import { Module } from '@nestjs/common';
import { EmailServiceNotification } from './email.service';

@Module({
  providers: [EmailServiceNotification],
  exports: [EmailServiceNotification],
})
export class EmailModule {}
