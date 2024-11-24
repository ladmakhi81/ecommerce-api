import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateVendorIncomeDTO } from './dtos';
import { OrderService } from 'src/order/order.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class VendorIncomeService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  async createVendorIncome(dto: CreateVendorIncomeDTO) {
    const orderItem = await this.orderService.getOrderItemById(dto.orderItemId);
    const vendor = orderItem.product.createdBy;
    const amount = orderItem.finalPrice;
    const fee = orderItem.product.fee;
    const finalAmount = amount - fee;
    const income = await this.prismaService.vendorIncomes.create({
      data: {
        amount,
        finalAmount,
        fee,
        orderItemId: orderItem.id,
        vendorId: vendor.id,
        transactionId: dto.transactionId,
      },
    });
    // send notification to vendor
    // send notification to super admin
    return income;
  }
}
