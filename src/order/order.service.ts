import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubmitOrderDTO } from './dtos';
import { OrderStatus, User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserCartService } from 'src/user-cart/user-cart.service';
import { UserAddressService } from 'src/user-address/user-address.service';
import { randomBytes } from 'crypto';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cartsService: UserCartService,
    private readonly userAddressService: UserAddressService,
    private readonly paymentService: PaymentService,
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
        discountAmount: 0,
        userAddressId: address.id,
        userId: customer.id,
      },
    });

    await Promise.all(
      carts.map((cart) =>
        this.prismaService.orderItem.create({
          data: {
            discountAmount: 0,
            finalPrice: cart.price,
            totalPrice: cart.price,
            quantity: cart.quantity,
            productId: cart.productId,
            orderId: order.id,
          },
        }),
      ),
    );

    const payLink = await this.paymentService.createPayment({
      amount: totalPrice,
      order,
      user: customer,
    });

    return { payLink, order: order.id };
  }

  async getOrderItemById(orderItemId: number) {
    const orderItem = await this.prismaService.orderItem.findUnique({
      where: { id: orderItemId },
      include: { product: { include: { createdBy: true } }, order: true },
    });
    if (!orderItem) {
      throw new NotFoundException('Order Item Not Found');
    }
    return orderItem;
  }

  private _generateDeliveryCode() {
    return randomBytes(20).toString('hex');
  }
}
