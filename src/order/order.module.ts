import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from 'src/user/user.module';
import { UserCartModule } from 'src/user-cart/user-cart.module';
import { UserAddressModule } from 'src/user-address/user-address.module';
import { PaymentModule } from 'src/payment/payment.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueKeys } from 'src/queue/queue-keys.constant';

@Module({
  imports: [
    UserModule,
    UserCartModule,
    UserAddressModule,
    PaymentModule,
    BullModule.registerQueue({ name: QueueKeys.SubmitCustomerOrderEmailQueue }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
