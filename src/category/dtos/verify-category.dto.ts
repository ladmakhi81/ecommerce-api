import { IsBoolean, IsNotEmpty } from 'class-validator';

export class VerifyCategoryDTO {
  @IsNotEmpty()
  @IsBoolean()
  isVerified: boolean;
}
