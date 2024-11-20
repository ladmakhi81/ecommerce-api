import { Queue } from 'bullmq';
import { LoginEmailQueuePayloadDTO } from 'src/queue/auth-queue-services/login-email-queue-processor.service';

export const LoginNotification = () => {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      const queue = this.loginEmailQueueService as Queue;
      const result = await originalMethod.apply(this, args);
      queue.add('send-email', new LoginEmailQueuePayloadDTO(args.at(0).email));
      return result;
    };
    return descriptor;
  };
};
