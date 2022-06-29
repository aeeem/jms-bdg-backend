import { Body, Controller, Delete, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { createProductService, deleteProductService, getAllProductsService, updateProductService } from "./product.service";


@Tags('Products')
@Route('/api/products')
export class ProductsController extends Controller{

  @Get('/')
  public async getAllProducts() {
    return getAllProductsService()
  }

  @Post('/create/')
  public async createProduct(@Body() body: { name: string }) {
    return createProductService({ name: body.name });
  }

  @Put('/update/{id}/')
  public async updateProduct(@Query('id') id: string, @Body() body: { name: string }) {
    return updateProductService({ id: Number(id), name: body.name });
  }

  @Delete('/delete/{id}/')
  public async deleteProduct(@Query('id') id: string) {
    return deleteProductService({ id: Number(id) });
  }

}