import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const PaginationQuery = createParamDecorator(
  (_: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest() as Request;
    const { page = 0, limit = 10 } = request.query;
    return { page: Number(page), limit: Number(limit) };
  },
);
