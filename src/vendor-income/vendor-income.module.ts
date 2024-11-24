import { Module } from '@nestjs/common';
import { VendorIncomeService } from './vendor-income.service';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [OrderModule],
  providers: [VendorIncomeService],
  exports: [VendorIncomeService],
})
export class VendorIncomeModule {}
