import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { UserService } from 'src/user/user.service';
import { SendEmailDTO } from 'src/notification/dtos';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SEND_EMAIL_NOTIFICATION } from 'src/notification/notification-events.constant';
import { QueueKeys } from '../queue-keys.constant';

export class SignupEmailQueuePayloadDTO {
  constructor(public email: string) {}
}

@Processor(QueueKeys.SignupEmailQueue)
export class SignupEmailQueueProcessorService extends WorkerHost {
  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process({ data }: Job<SignupEmailQueuePayloadDTO>): Promise<any> {
    const user = await this.userService.findUserByEmail(data.email);
    const payload = new SendEmailDTO(
      user.email,
      'Welcome To Our E-Commerce Application',
      `E-Commerce Is Platform To Manage Your Products and Sell Them As Vendor And Also Give You Report About Your Income. For Using This Platform First You Should Verify Your Account. Your Verification Code is ${user.verifiedToken}`,
    );
    this.eventEmitter.emit(SEND_EMAIL_NOTIFICATION, payload);
  }
}
