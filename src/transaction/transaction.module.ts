import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueKeys } from 'src/queue/queue-keys.constant';

@Module({
  providers: [TransactionService],
  exports: [TransactionService],
  imports: [
    BullModule.registerQueue({
      name: QueueKeys.ReturnBackOrderTransactionEmailQueue,
    }),
  ],
})
export class TransactionModule {}
