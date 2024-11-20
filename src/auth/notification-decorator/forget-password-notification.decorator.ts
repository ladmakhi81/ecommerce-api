import { Queue } from 'bullmq';
import { ForgetPasswordQueuePayloadDTO } from 'src/queue/auth-queue-services/forget-password-email-queue-processor.service';

export const ForgetPasswordNotification = () => {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      const queue = this.forgetPasswordEmailQueueService as Queue;
      const result = await originalMethod.apply(this, args);
      queue.add(
        'send-email',
        new ForgetPasswordQueuePayloadDTO(args.at(0).email),
      );
      return result;
    };
    return descriptor;
  };
};
