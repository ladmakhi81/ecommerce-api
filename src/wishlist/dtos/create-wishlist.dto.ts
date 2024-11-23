import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateWishListDTO {
  @IsNotEmpty()
  @IsInt()
  productId: number;
}
