import { Injectable } from '@nestjs/common';
import { SettleTransactionDTO } from './dtos';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  async settleTransaction(dto: SettleTransactionDTO) {
    // send notification for customer that transaction saved and execute
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
}
