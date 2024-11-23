import { Controller, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { AuthGuard } from 'src/common/decorators';
import { AuthRequest } from 'src/common/types';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post(':product')
  @AuthGuard()
  addProductToUserHistory(
    @Req() req: AuthRequest,
    @Param('product', ParseIntPipe) productId: number,
  ) {
    return this.historyService.addProductToHistory({
      productId,
      userId: req.user.id,
    });
  }
}
