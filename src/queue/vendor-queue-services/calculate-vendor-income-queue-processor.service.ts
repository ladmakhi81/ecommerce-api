import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueKeys } from '../queue-keys.constant';
import { Job } from 'bullmq';
import { VendorIncomeService } from 'src/vendor-income/vendor-income.service';

export class CalculateVendorIncomeQueuePayloadDTO {
  constructor(public items: { orderItemId: number; transactionId: number }[]) {}
}

@Processor(QueueKeys.CalculateVendorIncomeQueue)
export class CalculateVendorIncomeQueueProcessorService extends WorkerHost {
  constructor(private readonly vendorIncomeService: VendorIncomeService) {
    super();
  }

  async process({
    data,
  }: Job<CalculateVendorIncomeQueuePayloadDTO>): Promise<any> {
    await Promise.all(
      data.items.map((item) =>
        this.vendorIncomeService.createVendorIncome(item),
      ),
    );
  }
}
