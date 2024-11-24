import { Module } from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { UserAddressController } from './user-address.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [UserAddressService],
  controllers: [UserAddressController],
  imports: [UserModule],
  exports: [UserAddressService],
})
export class UserAddressModule {}
