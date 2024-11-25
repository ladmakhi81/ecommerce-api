import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueKeys } from '../queue-keys.constant';
import { Job } from 'bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SendEmailDTO } from 'src/notification/dtos';
import { SEND_EMAIL_NOTIFICATION } from 'src/notification/notification-events.constant';
import { VendorIncomeService } from 'src/vendor-income/vendor-income.service';
import { forwardRef, Inject } from '@nestjs/common';

export class VendorIncomeEmailPayloadDTO {
  constructor(public incomeId: number) {}
}

@Processor(QueueKeys.VendorIncomeEmailQueue)
export class VendorIncomeEmailQueueProcessorService extends WorkerHost {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => VendorIncomeService))
    private readonly vendorIncomeService: VendorIncomeService,
  ) {
    super();
  }

  async process({ data }: Job<VendorIncomeEmailPayloadDTO>): Promise<any> {
    const vendorIncome = await this.vendorIncomeService.getVendorIncomeById(
      data.incomeId,
    );
    const vendorName = vendorIncome.vendor.fullName;
    const vendorEmail = vendorIncome.vendor.email;
    const payload = new SendEmailDTO(
      vendorEmail,
      `Hey, You Have New Income ${vendorName}`,
      `${vendorName}, You Earn New Money With Amount Of ${vendorIncome.finalAmount.toLocaleString()} In ${vendorIncome.createdAt}. If You Want To Check, The Source Id Is ${vendorIncome.orderItemId}`,
    );
    this.eventEmitter.emit(SEND_EMAIL_NOTIFICATION, payload);
  }
}
