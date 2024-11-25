import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueKeys } from '../queue-keys.constant';
import { Job } from 'bullmq';
import { VendorIncomeService } from 'src/vendor-income/vendor-income.service';
import { SendEmailDTO } from 'src/notification/dtos';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SEND_EMAIL_NOTIFICATION } from 'src/notification/notification-events.constant';
import { forwardRef, Inject } from '@nestjs/common';

export class CancelVendorIncomeEmailPayloadDTO {
  constructor(public vendorIncomeId: number) {}
}

@Processor(QueueKeys.CancelVendorIncomeEmailQueue)
export class CancelVendorIncomeEmailQueueProcessorService extends WorkerHost {
  constructor(
    @Inject(forwardRef(() => VendorIncomeService))
    private readonly vendorIncomeService: VendorIncomeService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process({
    data,
  }: Job<CancelVendorIncomeEmailPayloadDTO>): Promise<any> {
    const vendorIncome = await this.vendorIncomeService.getVendorIncomeById(
      data.vendorIncomeId,
    );

    const payload = new SendEmailDTO(
      vendorIncome.vendor.email,
      `Your Vendor Income Canceled`,
      `${vendorIncome.vendor.fullName}, a Customer Request Returned Back Order And Accepted, So Your Income That Related To This Order With Amount Of ${vendorIncome.finalAmount} Deleted And Back To Customer`,
    );

    this.eventEmitter.emit(SEND_EMAIL_NOTIFICATION, payload);
  }
}
