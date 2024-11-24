import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPaymentDTO {
  @IsNotEmpty()
  @IsString()
  authority: string;
}
