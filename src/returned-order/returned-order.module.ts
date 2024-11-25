import { Module } from '@nestjs/common';
import { ReturnedOrderService } from './returned-order.service';
import { ReturnedOrderController } from './returned-order.controller';

@Module({
  providers: [ReturnedOrderService],
  controllers: [ReturnedOrderController]
})
export class ReturnedOrderModule {}
