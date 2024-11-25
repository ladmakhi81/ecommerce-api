import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateProductPriceItemDTO, UpdateProductPriceItemDTO } from './dtos';
import { ProductService } from 'src/product/product.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductPriceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async createPriceItem(dto: CreateProductPriceItemDTO) {
    await this._checkDuplicatedRecord(
      dto.title,
      dto.value,
      dto.product as number,
    );

    dto.product = (await this.productService.getProductById(
      dto.product as number,
    )) as Product;

    return this.prismaService.productPriceItem.create({
      data: {
        title: dto.title,
        isVisible: dto.isVisible,
        price: dto.price,
        type: dto.type,
        value: dto.value,
        productId: dto.product.id,
      },
    });
  }

  async updateProductPriceItemById(id: number, dto: UpdateProductPriceItemDTO) {
    const priceItem = await this.findProductPriceItemById(id);
    if (dto.title || dto.value) {
      await this._checkDuplicatedRecord(
        dto.title || priceItem.title,
        dto.value || priceItem.value,
        priceItem.productId,
        id,
      );
    }
    await this.prismaService.productPriceItem.update({
      where: { id: priceItem.id },
      data: { ...dto },
    });
  }

  async deleteProductPriceItemById(id: number) {
    const priceItem = await this.findProductPriceItemById(id);
    await this.prismaService.productPriceItem.delete({
      where: { id: priceItem.id },
    });
  }

  async findProductPriceItemById(id: number, loadProduct = false) {
    const productPriceItem =
      await this.prismaService.productPriceItem.findUnique({
        where: { id },
        include: { product: loadProduct },
      });
    if (!productPriceItem) {
      throw new NotFoundException('Product Price Item Not Found');
    }
    return productPriceItem;
  }

  async calculatePriceByPriceItem(priceItemId: number) {
    const priceItem = await this.findProductPriceItemById(priceItemId, true);
    return priceItem.price + priceItem.product.basePrice;
  }

  private async _checkDuplicatedRecord(
    title: string,
    value: string,
    productId: number,
    priceItemId?: number,
  ) {
    const priceItem = await this.prismaService.productPriceItem.findFirst({
      where:
        typeof priceItemId === typeof undefined
          ? {
              value,
              title,
              productId,
            }
          : {
              value,
              title,
              productId,
              NOT: { id: priceItemId },
            },
    });

    if (priceItem) {
      throw new ConflictException('Price Item Record Already Exist');
    }
  }
}
