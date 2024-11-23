import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthRequest } from 'src/common/types';
import { AuthGuard } from 'src/common/decorators';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':product')
  @AuthGuard()
  addProductToWishlist(
    @Param('product', ParseIntPipe) productId: number,
    @Req() req: AuthRequest,
  ) {
    return this.wishlistService.createWishlist(req.user, {
      productId: productId,
    });
  }

  @Delete(':product')
  @AuthGuard()
  deleteWishlist(
    @Param('product', ParseIntPipe) productId: number,
    @Req() req: AuthRequest,
  ) {
    return this.wishlistService.deleteWishlist(req.user, productId);
  }
}
