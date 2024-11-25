import { Queue } from 'bullmq';
import { CancelVendorIncomeEmailPayloadDTO } from 'src/queue/vendor-queue-services/cancel-vendor-income-email-queue-processor.service';

export const CancelVendorIncomeNotification = () => {
  return (_: any, __: string, propertyDescriptor: PropertyDescriptor) => {
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function (...args) {
      const result = await originalMethod.apply(this, args);
      const queue = this.cancelVendorIncomeQueue as Queue;
      const vendorIncomeId = args.at(0);
      queue.add(
        'cancel-vendor-income-email',
        new CancelVendorIncomeEmailPayloadDTO(vendorIncomeId),
      );
      return result;
    };
    return propertyDescriptor;
  };
};
