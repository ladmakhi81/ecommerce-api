import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDTO, UpdateProductDTO, VerifyProductDTO } from './dtos';
import { Category, User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  async createProduct(creator: User, dto: CreateProductDTO) {
    await this._checkProductNameDuplicate(dto.name);
    dto.category = (await this.categoryService.getCategoryById(
      dto.category as number,
    )) as Category;
    if (!dto.category.isVerified) {
      throw new BadRequestException(
        'Your Category Should Verified By Admin First',
      );
    }
    if (!dto.category.isPublished) {
      throw new NotFoundException('Category Not Published Yet');
    }
    return this.prismaService.product.create({
      data: {
        basePrice: dto.basePrice,
        description: dto.description,
        meta: dto.meta,
        name: dto.name,
        previewImage: dto.previewImage,
        categoryId: dto.category.id,
        createdById: creator.id,
        images: dto.images,
        isPublished: dto.isPublished,
        hasReturnedOrderOption: dto.hasReturnedOrderOption,
        returnedOrderOptionLimitDay: dto.returnedOrderOptionLimitDay,
      },
    });
  }

  async updateProductById(id: number, dto: UpdateProductDTO) {
    const product = await this.getProductById(id);
    if (product.isVerified) {
      throw new BadRequestException(
        "You Can't Change Product Information That Verified Before",
      );
    }
    if (dto.category) {
      dto.category = (await this.categoryService.getCategoryById(
        dto.category as number,
      )) as Category;
    }
    if (dto.name) {
      await this._checkProductNameDuplicate(dto.name, id);
    }
    await this.prismaService.product.update({
      where: { id: product.id },
      data: { ...dto } as any,
    });
  }

  async verifyProductById(dto: VerifyProductDTO, verifiedBy: User) {
    const product = await this.getProductById(dto.productId);
    await this.prismaService.product.update({
      where: { id: product.id },
      data: {
        isVerified: true,
        verifiedById: verifiedBy.id,
        verifiedDate: new Date(),
        fee: dto.fee,
      },
    });
  }

  async deleteProductById(id: number) {
    const product = await this.getProductById(id);
    await this.prismaService.product.delete({ where: { id: product.id } });
  }

  async getProducts(page: number, limit: number) {
    const content = await this.prismaService.product.findMany({
      orderBy: { id: 'desc' },
      skip: limit * page,
      take: limit,
      include: { category: true, createdBy: true, verifiedByUser: true },
    });
    const count = await this.prismaService.product.count();
    return { content, count };
  }

  async getProductById(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product Not Exist With This Id');
    }
    return product;
  }

  private async _checkProductNameDuplicate(name: string, id?: number) {
    const product = await this.prismaService.product.findFirst({
      where: typeof id === typeof undefined ? { name } : { name, NOT: { id } },
    });
    if (product) {
      throw new ConflictException('Product Name Is Already Exist');
    }
  }
}
