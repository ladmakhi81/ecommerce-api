import { Module } from '@nestjs/common';
import { UserCartController } from './user-cart.controller';
import { UserCartService } from './user-cart.service';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { ProductPriceModule } from 'src/product-price/product-price.module';

@Module({
  controllers: [UserCartController],
  providers: [UserCartService],
  imports: [UserModule, ProductModule, ProductPriceModule],
  exports: [UserCartService],
})
export class UserCartModule {}
