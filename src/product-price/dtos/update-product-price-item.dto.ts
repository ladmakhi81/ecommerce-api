import { ProductPriceType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateProductPriceItemDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  price?: number;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsEnum(ProductPriceType)
  type?: ProductPriceType;
}
