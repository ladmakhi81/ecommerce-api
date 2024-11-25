import { ReturnedOrderStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateReturnedOrderStatusDTO {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsEnum(ReturnedOrderStatus)
  status: ReturnedOrderStatus;
}
