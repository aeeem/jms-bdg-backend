import {
  Body, Controller, Delete, Get, Post, Put, Query, Route, Security, Tags
} from 'tsoa'
import { ProductRequestParameter } from './product.interfaces'
import {
  createProductService, deleteProductService, getAllProductsService, searchProductService, updateProductService
} from './product.service'

@Tags( 'Products' )
@Route( '/api/products' )

export class ProductsController extends Controller {
  @Get( '/' )
  @Security( 'api_key', ['read:product'] )
  public async getAllProducts () {
    return await getAllProductsService()
  }

  @Post( '/' )
  @Security( 'api_key', ['create:product'] )
  public async createProduct ( @Body() payload: ProductRequestParameter ) {
    return await createProductService( payload )
  }

  @Put( '/' )
  @Security( 'api_key', ['update:product'] )
  public async updateProduct ( @Query( 'id' ) id: string, @Body() payload: ProductRequestParameter ) {
    return await updateProductService( Number( id ), payload )
  }

  @Delete( '/' )
  @Security( 'api_key', ['delete:product'] )
  public async deleteProduct ( @Query( 'id' ) id: string ) {
    return await deleteProductService( { id: Number( id ) } )
  }

  @Get( '/search/' )
  @Security( 'api_key', ['read:product'] )
  public async searchProduct ( @Query( 'query' ) query: string ) {
    return await searchProductService( { query } )
  }
}
