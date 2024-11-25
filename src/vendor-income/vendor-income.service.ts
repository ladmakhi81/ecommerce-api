import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVendorIncomeDTO } from './dtos';
import { OrderService } from 'src/order/order.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  CancelVendorIncomeNotification,
  VendorIncomeNotification,
} from './notification-decorator';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueKeys } from 'src/queue/queue-keys.constant';
import { Queue } from 'bullmq';

@Injectable()
export class VendorIncomeService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    @InjectQueue(QueueKeys.VendorIncomeEmailQueue)
    public readonly vendorIncomeQueue: Queue,
    @InjectQueue(QueueKeys.CancelVendorIncomeEmailQueue)
    public readonly cancelVendorIncomeQueue: Queue,
  ) {}

  @VendorIncomeNotification()
  async createVendorIncome(dto: CreateVendorIncomeDTO) {
    const orderItem = await this.orderService.getOrderItemById(dto.orderItemId);
    const vendor = orderItem.product.createdBy;
    const amount = orderItem.finalPrice;
    const fee = orderItem.product.fee;
    const finalAmount = amount - fee;
    const income = await this.prismaService.vendorIncomes.create({
      data: {
        amount,
        finalAmount,
        fee,
        orderItemId: orderItem.id,
        vendorId: vendor.id,
        transactionId: dto.transactionId,
      },
    });
    return income;
  }

  @CancelVendorIncomeNotification()
  async cancelVendorIncomeForReturnedOrder(id: number) {
    const income = await this.getVendorIncomeById(id);
    await this.prismaService.vendorIncomes.update({
      where: { id: income.id },
      data: { isReturnedByCustomer: true },
    });
  }

  async getVendorIncomeById(incomeId: number) {
    const income = await this.prismaService.vendorIncomes.findUnique({
      where: { id: incomeId },
      include: { vendor: true },
    });
    if (!income) {
      throw new NotFoundException('Income Not Found');
    }
    return income;
  }
}
