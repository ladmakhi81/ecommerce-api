import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserAddressModule } from './user-address/user-address.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ProductPriceModule } from './product-price/product-price.module';
import { UserCartModule } from './user-cart/user-cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { TransactionModule } from './transaction/transaction.module';
import { ReturnedOrderModule } from './returned-order/returned-order.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { HistoryModule } from './history/history.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    UserAddressModule,
    CategoryModule,
    ProductModule,
    ProductPriceModule,
    UserCartModule,
    OrderModule,
    PaymentModule,
    TransactionModule,
    ReturnedOrderModule,
    WishlistModule,
    HistoryModule,
    CommonModule,
  ],
})
export class AppModule {}
