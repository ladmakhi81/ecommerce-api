import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateReturnedOrderDTO {
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsInt()
  orderItemId: number;
}
