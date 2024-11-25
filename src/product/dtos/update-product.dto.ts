import { Category } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  basePrice?: number;

  @IsOptional()
  @IsInt()
  category?: number | Category;

  @IsOptional()
  @IsString()
  @MinLength(7)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  previewImage?: string;

  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  hasReturnedOrderOption?: boolean;

  @IsOptional()
  @IsInt()
  returnedOrderOptionLimitDay?: number;
}
