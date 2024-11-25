import { Module } from '@nestjs/common';
import { ReturnedOrderService } from './returned-order.service';
import { ReturnedOrderController } from './returned-order.controller';
import { OrderModule } from 'src/order/order.module';
import { UserModule } from 'src/user/user.module';
import { VendorIncomeModule } from 'src/vendor-income/vendor-income.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueKeys } from 'src/queue/queue-keys.constant';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    OrderModule,
    UserModule,
    VendorIncomeModule,
    BullModule.registerQueue({
      name: QueueKeys.ChangeStatusReturnedOrderEmailQueue,
    }),
    TransactionModule,
  ],
  providers: [ReturnedOrderService],
  controllers: [ReturnedOrderController],
  exports: [ReturnedOrderService],
})
export class ReturnedOrderModule {}
