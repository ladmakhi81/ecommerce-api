import { Module } from '@nestjs/common';
import { ProductPriceController } from './product-price.controller';
import { ProductPriceService } from './product-price.service';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [UserModule, ProductModule],
  controllers: [ProductPriceController],
  providers: [ProductPriceService],
  exports: [ProductPriceService],
})
export class ProductPriceModule {}
