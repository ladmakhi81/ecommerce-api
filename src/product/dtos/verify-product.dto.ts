import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyProductDTO {
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  fee: number;
}
