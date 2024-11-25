import { Queue } from 'bullmq';
import { ChangeStatusReturnedOrderEmailPayloadDTO } from 'src/queue/returned-order-queue-services/change-status-email-returned-order-queue-processor.service';

export const ReturnBackOrderChangeStatusNotification = () => {
  return (_: any, __: string, propertyDescriptor: PropertyDescriptor) => {
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function (...args) {
      const queue = this.changeStatusReturnedOrderEmailQueue as Queue;
      const result = await originalMethod.apply(this, args);
      queue.add(
        'change-status-email',
        new ChangeStatusReturnedOrderEmailPayloadDTO(result.id),
      );
      return result;
    };
    return propertyDescriptor;
  };
};
