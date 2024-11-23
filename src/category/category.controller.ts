import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  VerifyCategoryDTO,
} from './dtos';
import { AuthGuard, PaginationQuery } from 'src/common/decorators';
import { IPaginationQuery } from 'src/common/types';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('upload-image')
  @AuthGuard()
  @UseInterceptors(FileInterceptor('image'))
  uploadCategoryImage(@UploadedFile() file: Express.Multer.File) {
    return this.categoryService.uploadCategoryImage(file);
  }

  @Post()
  @AuthGuard()
  createCategory(@Body() dto: CreateCategoryDTO) {
    return this.categoryService.createCategory(dto);
  }

  @Patch('verify/:id')
  @AuthGuard()
  verifyCategoryById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VerifyCategoryDTO,
  ) {
    return this.categoryService.verifyCategoryById(id, dto);
  }

  @Patch(':id')
  @AuthGuard()
  updateCategoryById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDTO,
  ) {
    return this.categoryService.updateCategoryById(id, dto);
  }

  @Delete(':id')
  @AuthGuard()
  deleteCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategoryById(id);
  }

  @Get()
  getCategories(@PaginationQuery() { limit, page }: IPaginationQuery) {
    return this.categoryService.getCategories(page, limit);
  }
}
