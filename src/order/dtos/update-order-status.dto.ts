import { OrderStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDTO {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
