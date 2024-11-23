import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCategoryDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  image?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
