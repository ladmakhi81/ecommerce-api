import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentService } from './payment.service';

@Injectable()
export class PaymentSchedule {
  constructor(private readonly paymentService: PaymentService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCanceledPayment() {
    await this.paymentService.changeCanceablePaymentStatusToCancel();
  }
}
