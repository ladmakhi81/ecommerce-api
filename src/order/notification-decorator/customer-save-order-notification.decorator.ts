import { Queue } from 'bullmq';
import { CustomerSubmitOrderEmailPayloadDTO } from 'src/queue/order-queue-services/customer-submit-order-email-queue-processor.service';

export const CustomerSaveOrderNotification = () => {
  return (_: any, __: string, propertyDescriptor: PropertyDescriptor) => {
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function (...args) {
      const result = await originalMethod.apply(this, args);
      const queue = this.submitCustomerOrderQueue as Queue;
      queue.add(
        'send-email-notification',
        new CustomerSubmitOrderEmailPayloadDTO(result.order),
      );
      return result;
    };
    return propertyDescriptor;
  };
};
