import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDTO, UpdateAddressDTO } from './dtos';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UserAddressService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAddress(user: User, dto: CreateAddressDTO) {
    await this._checkDuplicatedName(dto.name);
    return this.prismaService.userAddress.create({
      data: {
        address: dto.address,
        isActive: dto.isActive,
        latitude: dto.latitude,
        longitude: dto.longitude,
        name: dto.name,
        postalCode: dto.postalCode,
        userId: user.id,
      },
      include: { user: true },
    });
  }

  async updateAddressById(
    user: User,
    addressId: number,
    dto: UpdateAddressDTO,
  ) {
    const address = await this.getAddressByIdAndCheckOwner(addressId, user);
    if (dto.name) {
      await this._checkDuplicatedName(dto.name, addressId);
    }
    await this.prismaService.userAddress.update({
      where: { id: address.id },
      data: { ...dto },
    });
  }

  async deleteAddressById(id: number, user: User) {
    const address = await this.getAddressByIdAndCheckOwner(id, user);
    if (address.userId !== user.id) {
      throw new BadRequestException('Only The Owner Of Address Can Delete It');
    }
    await this.prismaService.userAddress.delete({ where: { id: address.id } });
  }

  async getAddressByIdAndCheckOwner(id: number, user: User) {
    const address = await this.prismaService.userAddress.findUnique({
      where: { id },
    });
    if (!address) {
      throw new NotFoundException('Address Not Found');
    }
    if (address.userId !== user.id) {
      throw new BadRequestException('Only The Owner Of Address Can Delete It');
    }
    return address;
  }

  private async _checkDuplicatedName(name: string, id?: number) {
    const address = await this.prismaService.userAddress.findFirst({
      where: typeof id === typeof undefined ? { name } : { name, NOT: { id } },
    });
    if (address) {
      throw new ConflictException('Address Already Exist With This Name');
    }
  }
}
