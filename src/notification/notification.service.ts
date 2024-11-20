import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SEND_EMAIL_NOTIFICATION } from './notification-events.constant';
import { EmailServiceNotification } from './email/email.service';
import { SendEmailDTO } from './dtos';

@Injectable()
export class NotificationService {
  constructor(private readonly emailService: EmailServiceNotification) {}

  @OnEvent(SEND_EMAIL_NOTIFICATION)
  sendSingleEmailNotification(dto: SendEmailDTO) {
    this.emailService.sendEmail(dto);
  }
}
