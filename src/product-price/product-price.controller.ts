import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductPriceService } from './product-price.service';
import { CreateProductPriceItemDTO, UpdateProductPriceItemDTO } from './dtos';
import { AuthGuard } from 'src/common/decorators';

@Controller('product-price')
export class ProductPriceController {
  constructor(private readonly productPriceService: ProductPriceService) {}

  @Post()
  @AuthGuard()
  createProductPriceItem(@Body() dto: CreateProductPriceItemDTO) {
    return this.productPriceService.createPriceItem(dto);
  }

  @Delete(':id')
  @AuthGuard()
  deleteProductPriceItem(@Param('id', ParseIntPipe) id: number) {
    return this.productPriceService.deleteProductPriceItemById(id);
  }

  @Patch(':id')
  @AuthGuard()
  updatProductPriceItem(
    @Body() dto: UpdateProductPriceItemDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productPriceService.updateProductPriceItemById(id, dto);
  }
}
