import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { ReturnedOrderService } from './returned-order.service';
import { AuthGuard, PaginationQuery } from 'src/common/decorators';
import { AuthRequest, IPaginationQuery } from 'src/common/types';
import { CreateReturnedOrderDTO, UpdateReturnedOrderStatusDTO } from './dtos';

@Controller('returned-order')
export class ReturnedOrderController {
  constructor(private readonly returnedOrderService: ReturnedOrderService) {}

  @Post()
  @AuthGuard()
  createReturnedOrder(
    @Req() { user }: AuthRequest,
    @Body() dto: CreateReturnedOrderDTO,
  ) {
    return this.returnedOrderService.createReturnedOrder(user, dto);
  }

  @Patch('update-status')
  @AuthGuard()
  updateReturnedOrderStatusByAdmin(@Body() dto: UpdateReturnedOrderStatusDTO) {
    return this.returnedOrderService.updateReturnedOrderStatus(dto);
  }

  @Get()
  @AuthGuard()
  getReturnedOrders(@PaginationQuery() { limit, page }: IPaginationQuery) {
    return this.returnedOrderService.getReturnedOrders(page, limit);
  }
}
