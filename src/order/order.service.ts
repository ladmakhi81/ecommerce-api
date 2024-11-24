import { BadRequestException, Injectable } from '@nestjs/common';
import { SubmitOrderDTO } from './dtos';
import { OrderStatus, User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserCartService } from 'src/user-cart/user-cart.service';
import { UserAddressService } from 'src/user-address/user-address.service';
import { randomBytes } from 'crypto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cartsService: UserCartService,
    private readonly userAddressService: UserAddressService,
  ) {}

  async submitOrder(customer: User, dto: SubmitOrderDTO) {
    if (!dto.userAddressId && !customer.currentAddressId) {
      throw new BadRequestException(
        'For Submit Order, You Must Have An Address',
      );
    }
    const addressId = dto.userAddressId || customer.currentAddressId;
    const address = await this.userAddressService.getAddressByIdAndCheckOwner(
      addressId,
      customer,
    );
    const carts = await this.cartsService.getCartsByIds(dto.cartIds);
    const totalPrice = carts.reduce(
      (result, cartItem) => result + cartItem.price * cartItem.quantity,
      0,
    );

    const order = await this.prismaService.order.create({
      data: {
        deliveryCode: this._generateDeliveryCode(),
        finalPrice: totalPrice,
        totalPrice,
        phoneNumber: dto.phoneNumber,
        status: OrderStatus.Processing,
        statusChangedAt: new Date(),
        carts: { connect: dto.cartIds.map((id) => ({ id })) },
        discountAmount: 0,
        userAddressId: address.id,
        userId: customer.id,
      },
    });

    return order;
  }

  private _generateDeliveryCode() {
    return randomBytes(20).toString('hex');
  }
}
