import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { ProductService } from 'src/product/product.service';
import { AddProductToUserCart, UpdateCartQualityDTO } from './dtos';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ProductPriceService } from 'src/product-price/product-price.service';

@Injectable()
export class UserCartService {
  constructor(
    private readonly productService: ProductService,
    private readonly prismaService: PrismaService,
    private readonly productPriceService: ProductPriceService,
  ) {}

  async addProductToUserCart(user: User, dto: AddProductToUserCart) {
    const product = await this.productService.getProductById(dto.productId);

    if (!product.isVerified) {
      throw new BadRequestException('Product Should Verified First');
    }
    if (!product.isPublished) {
      throw new BadRequestException('Product Not Published Yet');
    }
    const cart = await this._getCartByProductAndUser(
      product.id,
      user.id,
      false,
    );

    if (cart) {
      throw new BadRequestException('Cart Exist For This Product');
    }

    const productPrice =
      await this.productPriceService.calculatePriceByPriceItem(dto.priceItemId);

    return this.prismaService.cart.create({
      data: {
        price: productPrice,
        quantity: dto.quantity,
        customerId: user.id,
        productId: product.id,
      },
      include: {
        customer: true,
        product: true,
      },
    });
  }

  async getCartsByUserId(customerId: number, page: number, limit: number) {
    const content = await this.prismaService.cart.findMany({
      skip: page * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      where: { customerId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
    const count = await this.prismaService.cart.count({
      where: { customerId },
    });
    return { content, count };
  }

  async updateQuantityOfCart(
    { productId, quantity }: UpdateCartQualityDTO,
    user: User,
  ) {
    const cart = await this._getCartByProductAndUser(productId, user.id);
    await this.prismaService.cart.update({
      where: { id: cart.id },
      data: { quantity },
    });
  }

  async deleteCartByProductId(productId: number, customerId: number) {
    const cart = await this._getCartByProductAndUser(productId, customerId);
    await this.prismaService.cart.delete({ where: { id: cart.id } });
  }

  async getCartById(id: number) {
    const cart = await this.prismaService.cart.findUnique({ where: { id } });
    if (!cart) {
      throw new NotFoundException('Cart Not Found');
    }
    return cart;
  }

  async getCartsByIds(ids: number[]) {
    const carts = await this.prismaService.cart.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    if (carts.length !== ids.length) {
      throw new NotFoundException('Carts Not Found');
    }
    return carts;
  }

  async deleteCartsByIds(ids: number[]) {
    const carts = await this.prismaService.cart.findMany({
      where: { id: { in: ids } },
    });
    if (carts.length !== ids.length) {
      throw new NotFoundException('Cart Not Found');
    }
    await this.prismaService.cart.deleteMany({ where: { id: { in: ids } } });
  }

  private async _getCartByProductAndUser(
    productId: number,
    customerId: number,
    throwError = true,
  ) {
    const cart = await this.prismaService.cart.findFirst({
      where: { customerId, productId },
    });
    if (!cart && throwError) {
      throw new NotFoundException('No Cart Exist With This Product');
    }
    return cart;
  }
}
