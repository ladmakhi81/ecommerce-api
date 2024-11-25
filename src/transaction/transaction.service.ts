import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnBackOrderTransactionDTO, SettleTransactionDTO } from './dtos';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TransactionStatus } from '@prisma/client';
import { ReturnBackOrderTransactionNotification } from './notification-decorator';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueKeys } from 'src/queue/queue-keys.constant';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectQueue(QueueKeys.ReturnBackOrderTransactionEmailQueue)
    public readonly returnBackOrderTransactionEmailQueue: Queue,
  ) {}

  async settleTransaction(dto: SettleTransactionDTO) {
    return this.prismaService.transaction.create({
      data: {
        amount: dto.amount,
        authority: dto.authority,
        refId: dto.refId,
        status: TransactionStatus.Settle,
        customerId: dto.customerId,
        paymentId: dto.paymentId,
      },
    });
  }

  @ReturnBackOrderTransactionNotification()
  async returnBackOrderTransaction(dto: ReturnBackOrderTransactionDTO) {
    return this.prismaService.transaction.create({
      data: {
        amount: dto.amount,
        status: TransactionStatus.Return,
        customerId: dto.customerId,
      },
    });
  }

  async getTransactionById(id: number) {
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction Not Found');
    }

    return transaction;
  }
}
