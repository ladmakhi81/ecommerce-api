import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateBaseUserInfoByIdDTO {
  @IsOptional()
  @IsString()
  @MinLength(4)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}

export class UpdateUserByIdDTO extends UpdateBaseUserInfoByIdDTO {
  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  credit?: number;

  @IsOptional()
  @IsDate()
  lastLoginDate?: Date;
}
