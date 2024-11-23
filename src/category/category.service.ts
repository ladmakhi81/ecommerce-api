import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  VerifyCategoryDTO,
} from './dtos';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { randomBytes } from 'crypto';
import * as path from 'path';
import { createWriteStream } from 'fs';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCategory(dto: CreateCategoryDTO) {
    await this._checkDuplicatedName(dto.name);
    return this.prismaService.category.create({
      data: {
        name: dto.name,
        icon: dto.icon,
        isPublished: dto.isPublished,
        isVerified: false,
      },
    });
  }

  async verifyCategoryById(id: number, dto: VerifyCategoryDTO) {
    const category = await this.getCategoryById(id);
    await this.prismaService.category.update({
      where: { id: category.id },
      data: { isVerified: dto.isVerified },
    });
  }

  async deleteCategoryById(id: number) {
    const category = await this.getCategoryById(id);
    await this.prismaService.category.delete({ where: { id: category.id } });
  }

  async updateCategoryById(id: number, dto: UpdateCategoryDTO) {
    const category = await this.getCategoryById(id);
    if (dto.name) {
      await this._checkDuplicatedName(dto.name, id);
    }
    await this.prismaService.category.update({
      where: { id: category.id },
      data: { ...dto },
    });
  }

  async getCategories(page: number, limit: number) {
    const count = await this.prismaService.category.count({});
    const content = await this.prismaService.category.findMany({
      take: limit,
      skip: page * limit,
      orderBy: { createdAt: 'desc' },
    });
    return { content, count };
  }

  uploadCategoryImage(file: Express.Multer.File) {
    const basePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'images',
      'categories',
    );
    const extension = path.extname(file.originalname);
    const filename = `${randomBytes(20).toString('hex')}-${new Date().getTime()}${extension}`;
    const stream = createWriteStream(path.join(basePath, filename));
    stream.write(file.buffer);
    return { filename };
  }

  async getCategoryById(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category Not Found With This ID');
    }
    return category;
  }

  private async _checkDuplicatedName(name: string, id?: number) {
    const duplicatedCategoryName = await this.prismaService.category.findUnique(
      {
        where:
          typeof id === typeof undefined ? { name } : { name, NOT: { id } },
      },
    );
    if (duplicatedCategoryName) {
      throw new ConflictException('Category Name Is Already Exist');
    }
  }
}
