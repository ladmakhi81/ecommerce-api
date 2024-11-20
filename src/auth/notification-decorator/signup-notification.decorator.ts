import { Queue } from 'bullmq';
import { SignupEmailQueuePayloadDTO } from 'src/queue/auth-queue-services/signup-email-queue-processor.service';

export const SignupNotification = () => {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      const queue = this.signupEmailQueueService as Queue;
      const result = await originalMethod.apply(this, args);
      queue.add('send-email', new SignupEmailQueuePayloadDTO(args.at(0).email));
      return result;
    };
    return descriptor;
  };
};
