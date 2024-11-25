import { Queue } from 'bullmq';
import { VendorIncomeEmailPayloadDTO } from 'src/queue/vendor-queue-services/vendor-income-email-queue-processor.service';

export const VendorIncomeNotification = () => {
  return (_: any, __: any, propertyDescriptor: PropertyDescriptor) => {
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function (...args) {
      const queue = this.vendorIncomeQueue as Queue;
      const result = await originalMethod.apply(this, args);
      queue.add(
        'vendor-income-email-notification',
        new VendorIncomeEmailPayloadDTO(result.id),
      );
      return result;
    };
    return propertyDescriptor;
  };
};
