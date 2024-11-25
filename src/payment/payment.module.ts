import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ZarinpalModule } from 'src/zarinpal/zarinpal.module';
import { UserModule } from 'src/user/user.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueKeys } from 'src/queue/queue-keys.constant';
import { PaymentSchedule } from './payment.schedule';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentSchedule],
  imports: [
    ZarinpalModule,
    UserModule,
    TransactionModule,
    BullModule.registerQueue({ name: QueueKeys.CalculateVendorIncomeQueue }),
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
