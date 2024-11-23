import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { CreateWishListDTO } from './dtos';

@Injectable()
export class WishlistService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async createWishlist(user: User, dto: CreateWishListDTO) {
    const product = await this.productService.getProductById(dto.productId);
    return this.prismaService.productWhishlist.create({
      data: {
        productId: product.id,
        userId: user.id,
      },
      include: {
        product: true,
        user: true,
      },
    });
  }

  async deleteWishlist(user: User, productId: number) {
    const product = await this.productService.getProductById(productId);
    const wishList = await this.prismaService.productWhishlist.findUnique({
      where: {
        productId_userId: {
          productId: product.id,
          userId: user.id,
        },
      },
    });
    if (!wishList) {
      throw new NotFoundException(
        'No WishList Item Found With This Product And User',
      );
    }
    await this.prismaService.productWhishlist.delete({
      where: {
        productId_userId: {
          productId: product.id,
          userId: user.id,
        },
      },
    });
  }
}
