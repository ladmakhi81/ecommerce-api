import { applyDecorators, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards';

export const AuthGuard = () => {
  return applyDecorators(UseGuards(AccessTokenGuard));
};
