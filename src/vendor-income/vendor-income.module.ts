import { Module } from '@nestjs/common';
import { VendorIncomeService } from './vendor-income.service';
import { OrderModule } from 'src/order/order.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueKeys } from 'src/queue/queue-keys.constant';

@Module({
  imports: [
    OrderModule,
    BullModule.registerQueue({ name: QueueKeys.VendorIncomeEmailQueue }),
  ],
  providers: [VendorIncomeService],
  exports: [VendorIncomeService],
})
export class VendorIncomeModule {}
