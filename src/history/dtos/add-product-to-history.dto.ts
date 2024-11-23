import { IsInt, IsNotEmpty } from 'class-validator';

export class AddProductToHistoryDTO {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  productId: number;
}
