import { Injectable } from '@nestjs/common';
import { AddProductToHistoryDTO } from './dtos';
import { ProductService } from 'src/product/product.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(
    private readonly productService: ProductService,
    private readonly prismaService: PrismaService,
  ) {}

  async addProductToHistory(dto: AddProductToHistoryDTO) {
    const product = await this.productService.getProductById(dto.productId);
    const historyItem = await this._findHistoryItem(dto.userId, dto.productId);
    if (historyItem) {
      return this._increaseHistoryItemCount(dto.userId, product.id);
    }
    return this._createHistoryOfUserAndProduct(dto.userId, product.id);
  }

  private async _findHistoryItem(userId: number, productId: number) {
    return this.prismaService.userProductHistoryView.findUnique({
      where: { productId_userId: { productId, userId } },
    });
  }

  private _increaseHistoryItemCount(userId: number, productId: number) {
    return this.prismaService.userProductHistoryView.update({
      where: { productId_userId: { productId, userId } },
      data: { count: { increment: 1 } },
      include: { product: true, user: true },
    });
  }

  private _createHistoryOfUserAndProduct(userId: number, productId: number) {
    return this.prismaService.userProductHistoryView.create({
      data: { count: 1, productId, userId },
      include: { product: true, user: true },
    });
  }
}
