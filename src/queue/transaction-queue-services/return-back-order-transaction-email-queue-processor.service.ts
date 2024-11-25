import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueKeys } from '../queue-keys.constant';
import { Job } from 'bullmq';
import { TransactionService } from 'src/transaction/transaction.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { forwardRef, Inject } from '@nestjs/common';
import { SendEmailDTO } from 'src/notification/dtos';
import { SEND_EMAIL_NOTIFICATION } from 'src/notification/notification-events.constant';

export class ReturnBackOrderTransactionEmailPayloadDTO {
  constructor(public transactionId: number) {}
}

@Processor(QueueKeys.ReturnBackOrderTransactionEmailQueue)
export class ReturnBackOrderTransactionEmailQueueProcessorService extends WorkerHost {
  constructor(
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process({
    data,
  }: Job<ReturnBackOrderTransactionEmailPayloadDTO>): Promise<any> {
    const transaction = await this.transactionService.getTransactionById(
      data.transactionId,
    );
    const payload = new SendEmailDTO(
      transaction.customer.email,
      `Hey ${transaction.customer.fullName}, I Have Good News For You`,
      `You Create An Issue And That Issue Accepted And The Money ( ${transaction.amount.toLocaleString()} ) You Pay Will Back Into Your Cash`,
    );
    this.eventEmitter.emit(SEND_EMAIL_NOTIFICATION, payload);
  }
}
