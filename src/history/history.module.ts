import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [HistoryService],
  controllers: [HistoryController],
  imports: [ProductModule, UserModule],
})
export class HistoryModule {}
