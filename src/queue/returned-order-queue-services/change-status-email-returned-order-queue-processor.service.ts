import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueKeys } from '../queue-keys.constant';
import { Job } from 'bullmq';
import { ReturnedOrderService } from 'src/returned-order/returned-order.service';
import { SendEmailDTO } from 'src/notification/dtos';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SEND_EMAIL_NOTIFICATION } from 'src/notification/notification-events.constant';
import { forwardRef, Inject } from '@nestjs/common';

export class ChangeStatusReturnedOrderEmailPayloadDTO {
  constructor(public returnedOrderId: number) {}
}

@Processor(QueueKeys.ChangeStatusReturnedOrderEmailQueue)
export class ChangeStatusReturnedOrderQueueProcessorService extends WorkerHost {
  constructor(
    @Inject(forwardRef(() => ReturnedOrderService))
    private readonly returnedOrderService: ReturnedOrderService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process({
    data,
  }: Job<ChangeStatusReturnedOrderEmailPayloadDTO>): Promise<any> {
    const returnedOrder = await this.returnedOrderService.getReturnedOrderById(
      data.returnedOrderId,
    );
    const payload = new SendEmailDTO(
      returnedOrder.customer.email,
      `Change Status Of Your Issue`,
      `${returnedOrder.customer.fullName} Your Issue ( Returned Order ) With Id ${returnedOrder.id} Change Status to ${returnedOrder.status}`,
    );
    this.eventEmitter.emit(SEND_EMAIL_NOTIFICATION, payload);
  }
}
