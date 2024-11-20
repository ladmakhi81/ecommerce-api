import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueKeys } from 'src/queue/queue-keys.constant';

@Module({
  imports: [
    UserModule,
    BullModule.registerQueue({ name: QueueKeys.LoginEmailQueue }),
    BullModule.registerQueue({ name: QueueKeys.SignupEmailQueue }),
    BullModule.registerQueue({ name: QueueKeys.ForgetPasswordEmailQueue }),
    BullModule.registerQueue({ name: QueueKeys.VerifyAccountEmailQueue }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
