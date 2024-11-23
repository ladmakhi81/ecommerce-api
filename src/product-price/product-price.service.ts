import { Injectable, NotFoundException } from '@nestjs/common';
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
}
