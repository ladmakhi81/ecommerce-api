import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueKeys } from '../queue-keys.constant';
import { Job } from 'bullmq';
import { OrderService } from 'src/order/order.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SendEmailDTO } from 'src/notification/dtos';
import { SEND_EMAIL_NOTIFICATION } from 'src/notification/notification-events.constant';
import { forwardRef, Inject } from '@nestjs/common';

export class CustomerSubmitOrderEmailPayloadDTO {
  constructor(public orderId: number) {}
}

@Processor(QueueKeys.SubmitCustomerOrderEmailQueue)
export class CustomerSubmitOrderEmailQueueProcessor extends WorkerHost {
  constructor(
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process({
    data,
  }: Job<CustomerSubmitOrderEmailPayloadDTO>): Promise<any> {
    const order = await this.orderService.getOrderById(data.orderId);
    const customerName = order.user.fullName;
    const sendEmailDTO = new SendEmailDTO(
      order.user.email,
      `New Order Submited For ${customerName}`,
      `New Order Created With Price ${order.finalPrice.toLocaleString()} and Address ${order.userAddress.address} In ${order.createdAt}`,
    );
    this.eventEmitter.emit(SEND_EMAIL_NOTIFICATION, sendEmailDTO);
  }
}
