import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from 'src/user/user.module';
import { UserCartModule } from 'src/user-cart/user-cart.module';
import { UserAddressModule } from 'src/user-address/user-address.module';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [UserModule, UserCartModule, UserAddressModule],
})
export class OrderModule {}
