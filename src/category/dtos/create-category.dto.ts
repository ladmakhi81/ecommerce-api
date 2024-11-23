import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  icon: string;

  @IsNotEmpty()
  @IsBoolean()
  isPublished: boolean;
}
