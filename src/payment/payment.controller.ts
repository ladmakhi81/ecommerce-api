import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthGuard } from 'src/common/decorators';
import { VerifyPaymentDTO } from './dtos';
import { AuthRequest } from 'src/common/types';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('verify')
  @AuthGuard()
  verifyPayment(@Body() dto: VerifyPaymentDTO, @Req() { user }: AuthRequest) {
    return this.paymentService.verifyPayment(user, dto);
  }
}
