import { Queue } from 'bullmq';
import { VerifyAccountEmailQueuePayloadDTO } from 'src/queue/auth-queue-services/verify-account-email-queue-processor.service';

export const VerifyAccountNotification = () => {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      const queue = this.verifyAccountEmailQueueService as Queue;
      const result = await originalMethod.apply(this, args);
      queue.add(
        'send-email',
        new VerifyAccountEmailQueuePayloadDTO(args.at(0).email),
      );
      return result;
    };
    return descriptor;
  };
};
