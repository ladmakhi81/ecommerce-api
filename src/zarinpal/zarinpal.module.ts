import { Module } from '@nestjs/common';
import { ZarinpalService } from './zarinpal.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [ZarinpalService],
  imports: [HttpModule],
  exports: [ZarinpalService],
})
export class ZarinpalModule {}
