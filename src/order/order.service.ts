import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubmitOrderDTO, UpdateOrderStatusDTO } from './dtos';
import { OrderStatus, PaymentStatus, User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserCartService } from 'src/user-cart/user-cart.service';
import { UserAddressService } from 'src/user-address/user-address.service';
import { randomBytes } from 'crypto';
import { PaymentService } from 'src/payment/payment.service';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueKeys } from 'src/queue/queue-keys.constant';
import { Queue } from 'bullmq';
import { CustomerSaveOrderNotification } from './notification-decorator';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cartsService: UserCartService,
    private readonly userAddressService: UserAddressService,
    private readonly paymentService: PaymentService,
    @InjectQueue(QueueKeys.SubmitCustomerOrderEmailQueue)
    public readonly submitCustomerOrderQueue: Queue,
  ) {}

  @CustomerSaveOrderNotification()
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

    await this.cartsService.deleteCartsByIds(dto.cartIds);

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
      include: {
        product: { include: { createdBy: true } },
        order: true,
        returnedOrder: true,
      },
    });
    if (!orderItem) {
      throw new NotFoundException('Order Item Not Found');
    }
    return orderItem;
  }

  async getOrderById(orderId: number) {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
      include: { payment: true, user: true, userAddress: true },
    });
    if (!order) {
      throw new NotFoundException('Order Not Found');
    }
    return order;
  }

  async updateOrderStatus(dto: UpdateOrderStatusDTO) {
    const order = await this.getOrderById(dto.id);

    if (order.payment?.status !== PaymentStatus.Payed) {
      throw new BadRequestException(
        'You Can Change Order Status That Settled By Customer',
      );
    }
    const baseUpdatePayload = {
      status: dto.status,
      statusChangedAt: new Date(),
    };

    await this.prismaService.order.update({
      where: { id: order.id },
      data:
        dto.status === OrderStatus.OutOfDelivery
          ? {
              deliveryCode: this._generateDeliveryCode(),
              ...baseUpdatePayload,
            }
          : baseUpdatePayload,
    });
  }

  async getOrders(page: number, limit: number) {
    const content = await this.prismaService.order.findMany({
      skip: page * limit,
      take: limit,
      include: { payment: true, items: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
    const count = await this.prismaService.order.count();
    return { content, count };
  }

  private _generateDeliveryCode() {
    return randomBytes(20).toString('hex');
  }
}
