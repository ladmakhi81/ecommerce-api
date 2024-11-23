import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAddressDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  address: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  latitude: number;

  @IsNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  longitude: number;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
