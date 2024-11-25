import { Module } from '@nestjs/common';
import { LoginEmailQueueProcessorService } from './auth-queue-services/login-email-queue-processor.service';
import { UserModule } from 'src/user/user.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignupEmailQueueProcessorService } from './auth-queue-services/signup-email-queue-processor.service';
import { ForgetPasswordEmailQueueProcessorService } from './auth-queue-services/forget-password-email-queue-processor.service';
import { VerifyAccountEmailQueueProcessorService } from './auth-queue-services/verify-account-email-queue-processor.service';
import { CalculateVendorIncomeQueueProcessorService } from './vendor-queue-services/calculate-vendor-income-queue-processor.service';
import { VendorIncomeModule } from 'src/vendor-income/vendor-income.module';
import { VendorIncomeEmailQueueProcessorService } from './vendor-queue-services/vendor-income-email-queue-processor.service';
import { CustomerSubmitOrderEmailQueueProcessor } from './order-queue-services/customer-submit-order-email-queue-processor.service';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
    }),
    UserModule,
    VendorIncomeModule,
    OrderModule,
  ],
  providers: [
    LoginEmailQueueProcessorService,
    SignupEmailQueueProcessorService,
    ForgetPasswordEmailQueueProcessorService,
    VerifyAccountEmailQueueProcessorService,
    CalculateVendorIncomeQueueProcessorService,
    VendorIncomeEmailQueueProcessorService,
    CustomerSubmitOrderEmailQueueProcessor,
  ],
})
export class QueueModule {}
