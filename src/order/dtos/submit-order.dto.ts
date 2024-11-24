import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SubmitOrderDTO {
  @IsNotEmpty()
  @IsInt({ each: true })
  @IsArray()
  cartIds: number[];

  @IsOptional()
  @IsInt()
  userAddressId?: number;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
