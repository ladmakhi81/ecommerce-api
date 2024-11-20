import { UserRole } from '@prisma/client';

export class DecodeAuthTokenDTO {
  userId: number;
  role: UserRole;
  isVerifiedAccount: boolean;
}
