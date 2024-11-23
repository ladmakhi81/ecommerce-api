import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  providers: [WishlistService],
  controllers: [WishlistController],
  imports: [UserModule, ProductModule],
})
export class WishlistModule {}
