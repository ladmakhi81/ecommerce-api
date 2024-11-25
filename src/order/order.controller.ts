import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { SubmitOrderDTO, UpdateOrderStatusDTO } from './dtos';
import { AuthGuard, PaginationQuery } from 'src/common/decorators';
import { AuthRequest, IPaginationQuery } from 'src/common/types';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('submit')
  @AuthGuard()
  submitOrder(@Body() dto: SubmitOrderDTO, @Req() { user }: AuthRequest) {
    return this.orderService.submitOrder(user, dto);
  }

  @Patch('update-status')
  @AuthGuard()
  updateOrderStatus(@Body() dto: UpdateOrderStatusDTO) {
    return this.orderService.updateOrderStatus(dto);
  }

  @Get()
  @AuthGuard()
  getOrders(@PaginationQuery() { limit, page }: IPaginationQuery) {
    return this.orderService.getOrders(page, limit);
  }
}
