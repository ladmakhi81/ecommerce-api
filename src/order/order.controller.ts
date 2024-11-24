import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { SubmitOrderDTO } from './dtos';
import { AuthGuard } from 'src/common/decorators';
import { AuthRequest } from 'src/common/types';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('submit')
  @AuthGuard()
  submitOrder(@Body() dto: SubmitOrderDTO, @Req() { user }: AuthRequest) {
    return this.orderService.submitOrder(user, dto);
  }
}
