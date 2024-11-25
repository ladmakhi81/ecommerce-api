import { Category } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  isPublished: boolean;

  @IsNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  basePrice: number;

  @IsNotEmpty()
  @IsInt()
  category: number | Category;

  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  description: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  previewImage: string;

  @IsNotEmpty()
  @IsObject()
  meta: Record<string, any>;

  @IsNotEmpty()
  @IsBoolean()
  hasReturnedOrderOption: boolean;

  @IsOptional()
  @IsInt()
  returnedOrderOptionLimitDay?: number;
}
