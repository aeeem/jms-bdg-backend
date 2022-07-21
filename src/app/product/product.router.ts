import { Body, Controller, Delete, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { ProductRequestParameter } from "./product.interfaces";
import { createProductService, deleteProductService, getAllProductsService, searchProductService, updateProductService } from "./product.service";

@Tags('Products')
@Route('/api/products')
export class ProductsController extends Controller{

  @Get('/')
  public async getAllProducts() {
    return getAllProductsService()
  }

  @Post('/')
  public async createProduct(@Body() payload: ProductRequestParameter) {
    return createProductService(payload);
  }

  @Put('/{id}/')
  public async updateProduct(@Query('id') id: string, @Body() payload: ProductRequestParameter) {
    return updateProductService(Number(id), payload);
  }

  @Delete('/{id}/')
  public async deleteProduct(@Query('id') id: string) {
    return deleteProductService({ id: Number(id) });
  }

  @Get('/search/:query')
  public async searchProduct(@Query('query') query: string) {
    return searchProductService({ query });
  }

}