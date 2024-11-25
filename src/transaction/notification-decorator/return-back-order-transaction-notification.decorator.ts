import { Queue } from 'bullmq';
import { ReturnBackOrderTransactionEmailPayloadDTO } from 'src/queue/transaction-queue-services/return-back-order-transaction-email-queue-processor.service';

export const ReturnBackOrderTransactionNotification = () => {
  return (_: any, __: string, propertyDescriptor: PropertyDescriptor) => {
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function (...args) {
      const result = await originalMethod.apply(this, args);
      const queue = this.returnBackOrderTransactionEmailQueue as Queue;
      const transactionId = result.id;
      queue.add(
        'send-transaction-back-order-email',
        new ReturnBackOrderTransactionEmailPayloadDTO(transactionId),
      );
      return result;
    };
    return propertyDescriptor;
  };
};
