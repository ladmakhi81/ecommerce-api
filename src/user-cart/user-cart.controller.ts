import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserCartService } from './user-cart.service';
import { AuthGuard, PaginationQuery } from 'src/common/decorators';
import { AuthRequest, IPaginationQuery } from 'src/common/types';
import { AddProductToUserCart, UpdateCartQualityDTO } from './dtos';

@Controller('user-cart')
export class UserCartController {
  constructor(private readonly userCartService: UserCartService) {}

  @Post()
  @AuthGuard()
  addProductToUserCart(
    @Req() req: AuthRequest,
    @Body() dto: AddProductToUserCart,
  ) {
    return this.userCartService.addProductToUserCart(req.user, dto);
  }

  @Get('customer')
  @AuthGuard()
  getCartsByCustomerId(
    @Req() req: AuthRequest,
    @PaginationQuery() { limit, page }: IPaginationQuery,
  ) {
    return this.userCartService.getCartsByUserId(req.user.id, page, limit);
  }

  @Patch('change-quantity')
  @AuthGuard()
  changeQuantityOfCartById(
    @Body() dto: UpdateCartQualityDTO,
    @Req() req: AuthRequest,
  ) {
    return this.userCartService.updateQuantityOfCart(dto, req.user);
  }

  @Delete(':product')
  @AuthGuard()
  deleteCartByProduct(
    @Param('product', ParseIntPipe) productId: number,
    @Req() req: AuthRequest,
  ) {
    return this.userCartService.deleteCartByProductId(productId, req.user.id);
  }
}
