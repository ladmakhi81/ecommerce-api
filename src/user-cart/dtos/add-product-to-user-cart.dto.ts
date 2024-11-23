import { IsInt, IsNotEmpty } from 'class-validator';

export class AddProductToUserCart {
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  priceItemId: number;

  @IsInt()
  quantity: number;
}
