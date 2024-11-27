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
import { UserAddressService } from './user-address.service';
import { AuthGuard } from 'src/common/decorators';
import { AuthRequest } from 'src/common/types';
import { CreateAddressDTO, UpdateAddressDTO } from './dtos';

@AuthGuard()
@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post()
  createUserAddress(@Req() req: AuthRequest, @Body() dto: CreateAddressDTO) {
    return this.userAddressService.createAddress(req.user, dto);
  }

  @Patch('user/set-current-address/:address')
  setCurrentAddressUser(
    @Param('address', ParseIntPipe) address: number,
    @Req() { user }: AuthRequest,
  ) {
    return this.userAddressService.updateUserCurrentAddress(user, address);
  }

  @Delete(':id')
  deleteUserAddressById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
  ) {
    return this.userAddressService.deleteAddressById(id, req.user);
  }

  @Patch(':id')
  updateUserAddress(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
    @Body() dto: UpdateAddressDTO,
  ) {
    return this.userAddressService.updateAddressById(req.user, id, dto);
  }

  @Get('own')
  getUserAddresses(@Req() { user }: AuthRequest) {
    return this.userAddressService.getUserAddresses(user.id);
  }
}
