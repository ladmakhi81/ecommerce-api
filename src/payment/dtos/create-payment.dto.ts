import { Order, User } from '@prisma/client';

export class CreatePaymentDTO {
  user: User;
  order: Order;
  amount: number;
}
