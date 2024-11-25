import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ZarinpalService } from 'src/zarinpal/zarinpal.service';
import { CreatePaymentDTO, VerifyPaymentDTO } from './dtos';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { OrderItem, PaymentStatus, Transaction, User } from '@prisma/client';
import { TransactionService } from 'src/transaction/transaction.service';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueKeys } from 'src/queue/queue-keys.constant';
import { Queue } from 'bullmq';
import { CalculateVendorIncomeQueuePayloadDTO } from 'src/queue/vendor-queue-services/calculate-vendor-income-queue-processor.service';
import * as moment from 'moment';

@Injectable()
export class PaymentService {
  constructor(
    private readonly zarinpalService: ZarinpalService,
    private readonly prismaService: PrismaService,
    private readonly transactionService: TransactionService,
    @InjectQueue(QueueKeys.CalculateVendorIncomeQueue)
    private readonly vendorIncomeQueue: Queue,
  ) {}

  async createPayment(dto: CreatePaymentDTO) {
    const { payLink, authority } =
      await this.zarinpalService.initializePaymentGateway(dto.amount);
    return this.prismaService.payment.create({
      data: {
        amount: dto.amount,
        link: payLink,
        status: PaymentStatus.NotPayed,
        orderId: dto.order.id,
        userId: dto.user.id,
        authority,
      },
    });
  }

  async verifyPayment(customer: User, dto: VerifyPaymentDTO) {
    const payment = await this.getPaymentByAuthority(dto.authority);
    if (payment.status !== PaymentStatus.NotPayed) {
      throw new BadRequestException('Payment Not Exist');
    }
    const refId = await this.zarinpalService.verifyTransactionBank({
      amount: payment.amount,
      authority: payment.authority,
    });
    await this._payThePayment(payment.id);

    const transaction = await this.transactionService.settleTransaction({
      amount: payment.amount,
      authority: payment.authority,
      customerId: customer.id,
      paymentId: payment.id,
      refId,
    });

    await this._notifyVendorIncomeToCalculation(
      payment.order.items,
      transaction,
    );
  }

  async getPaymentByAuthority(authority: string) {
    const payment = await this.prismaService.payment.findFirst({
      where: { authority },
      include: { order: { include: { items: true } } },
    });
    if (!payment) {
      throw new NotFoundException('Payment Not Found');
    }
    return payment;
  }

  changeCanceablePaymentStatusToCancel() {
    return this.prismaService.payment.updateMany({
      where: {
        createdAt: { lt: moment().subtract(30, 'minute').toISOString() },
        status: PaymentStatus.NotPayed,
      },
      data: {
        status: PaymentStatus.Canceled,
      },
    });
  }

  private async _payThePayment(id: number) {
    await this.prismaService.payment.update({
      where: { id },
      data: { payedAt: new Date(), status: PaymentStatus.Payed },
    });
  }

  private _notifyVendorIncomeToCalculation(
    items: OrderItem[],
    transaction: Transaction,
  ) {
    this.vendorIncomeQueue.add(
      'calculate-vendor-income',
      new CalculateVendorIncomeQueuePayloadDTO(
        items.map((item) => ({
          orderItemId: item.id,
          transactionId: transaction.id,
        })),
      ),
    );
  }
}
