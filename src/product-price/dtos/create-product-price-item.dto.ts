import { Product, ProductPriceType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductPriceItemDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  price: number;

  @IsNotEmpty()
  @IsBoolean()
  isVisible: boolean;

  @IsNotEmpty()
  @IsEnum(ProductPriceType)
  type: ProductPriceType;

  @IsNotEmpty()
  @IsInt()
  product: number | Product;
}
