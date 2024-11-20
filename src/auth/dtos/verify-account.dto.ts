import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyAccountDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  verificationCode: string;
}
