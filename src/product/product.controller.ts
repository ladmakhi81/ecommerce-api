import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AuthGuard, PaginationQuery } from 'src/common/decorators';
import { AuthRequest, IPaginationQuery } from 'src/common/types';
import { CreateProductDTO, UpdateProductDTO, VerifyProductDTO } from './dtos';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @AuthGuard()
  createProduct(@Req() req: AuthRequest, @Body() dto: CreateProductDTO) {
    return this.productService.createProduct(req.user, dto);
  }

  @Patch('verify')
  @AuthGuard()
  verifyProductById(@Req() req: AuthRequest, @Body() dto: VerifyProductDTO) {
    return this.productService.verifyProductById(dto, req.user);
  }

  @Delete(':id')
  @AuthGuard()
  deleteProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProductById(id);
  }

  @Get()
  getProducts(@PaginationQuery() { limit, page }: IPaginationQuery) {
    return this.productService.getProducts(page, limit);
  }

  @Patch(':id')
  @AuthGuard()
  updateProductById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDTO,
  ) {
    return this.productService.updateProductById(id, dto);
  }
}
