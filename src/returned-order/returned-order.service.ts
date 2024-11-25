import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReturnedOrderDTO, UpdateReturnedOrderStatusDTO } from './dtos';
import { ReturnedOrderStatus, User } from '@prisma/client';
import { OrderService } from 'src/order/order.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { VendorIncomeService } from 'src/vendor-income/vendor-income.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { ReturnBackOrderChangeStatusNotification } from './notification-decorator';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueKeys } from 'src/queue/queue-keys.constant';
import { Queue } from 'bullmq';
import * as moment from 'moment';

@Injectable()
export class ReturnedOrderService {
  constructor(
    private readonly orderService: OrderService,
    private readonly prismaService: PrismaService,
    private readonly vendorIncomeService: VendorIncomeService,
    private readonly transactionService: TransactionService,
    @InjectQueue(QueueKeys.ChangeStatusReturnedOrderEmailQueue)
    public readonly changeStatusReturnedOrderEmailQueue: Queue,
  ) {}

  async createReturnedOrder(customer: User, dto: CreateReturnedOrderDTO) {
    const orderItem = await this.orderService.getOrderItemById(dto.orderItemId);
    if (!orderItem.product.hasReturnedOrderOption) {
      throw new BadRequestException("This Product Don't Support Return Back");
    }
    const reachLimitDay = moment(orderItem.order.createdAt, 'YYYY-MM-DD')
      .add(orderItem.product.returnedOrderOptionLimitDay, 'day')
      .isBefore(orderItem.order.createdAt);

    if (reachLimitDay) {
      throw new BadRequestException("You Can't Use Return Back Order");
    }

    if (orderItem.returnedOrder) {
      throw new BadRequestException(
        "This Order Item Can't Have Any Other Returned Order",
      );
    }
    return this.prismaService.returnedOrder.create({
      data: {
        status: ReturnedOrderStatus.Pending,
        reason: dto.reason,
        orderItemId: orderItem.id,
        statusChangedAt: new Date(),
        customerId: customer.id,
      },
    });
  }

  @ReturnBackOrderChangeStatusNotification()
  async updateReturnedOrderStatus(dto: UpdateReturnedOrderStatusDTO) {
    const returnedOrder = await this.getReturnedOrderById(dto.id);
    const updatedReturnedOrder = await this.prismaService.returnedOrder.update({
      where: { id: returnedOrder.id },
      data: { status: dto.status, statusChangedAt: new Date() },
    });
    if (updatedReturnedOrder.status === ReturnedOrderStatus.Accept) {
      await this.vendorIncomeService.cancelVendorIncomeForReturnedOrder(
        returnedOrder.orderItem.vendorIncome.id,
      );
      await this.transactionService.returnBackOrderTransaction({
        amount: returnedOrder.orderItem.finalPrice,
        customerId: returnedOrder.customerId,
      });
    }
    return updatedReturnedOrder;
  }

  async getReturnedOrderById(id: number) {
    const returnedOrder = await this.prismaService.returnedOrder.findUnique({
      where: { id },
      include: {
        orderItem: { include: { vendorIncome: true } },
        customer: true,
      },
    });
    if (!returnedOrder) {
      throw new NotFoundException('Returned Order Not Found');
    }
    return returnedOrder;
  }

  async getReturnedOrders(page: number, limit: number) {
    return this.prismaService.returnedOrder.findMany({
      skip: page * limit,
      take: limit,
      include: { customer: true, orderItem: { include: { order: true } } },
    });
  }
}
