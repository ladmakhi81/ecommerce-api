import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserService } from 'src/user/user.service';
import { SendEmailDTO } from 'src/notification/dtos';
import { SEND_EMAIL_NOTIFICATION } from 'src/notification/notification-events.constant';
import { QueueKeys } from '../queue-keys.constant';

export class ForgetPasswordQueuePayloadDTO {
  constructor(public email: string) {}
}

@Processor(QueueKeys.ForgetPasswordEmailQueue)
export class ForgetPasswordEmailQueueProcessorService extends WorkerHost {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UserService,
  ) {
    super();
  }

  async process({ data }: Job<ForgetPasswordQueuePayloadDTO>): Promise<any> {
    const user = await this.userService.findUserByEmail(data.email);
    const sendEmailPayload = new SendEmailDTO(
      user.email,
      `Forget Password Process`,
      `After Changing Password You Should Verify Your Account. Your Verification Code is : ${user.verifiedToken}`,
    );
    this.eventEmitter.emit(SEND_EMAIL_NOTIFICATION, sendEmailPayload);
  }
}
