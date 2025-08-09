import makeResponse, { OffsetFromPage, TotalPage } from 'src/helper/response'
import {
  Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, Tags
} from 'tsoa'
import {
  MixedProductRequestParameter,
  ProductRequestParameter,
  UpdateProductParameter
} from './product.interfaces'
import {
  addMixedProductService,
  createProductService, deleteProductService, getAllProductsService, searchProductService, updateProductService
} from './product.service'

@Tags( 'Products' )
@Route( '/api/products' )
export class ProductsController extends Controller {
  @Get( '/' )
  @Security( 'api_key', ['read:product'] )
  public async getAllProducts (
  @Query() page: number,
    @Query() limit: number,
    @Query() orderByColumn?: string,
    @Query() Order?: string,
    @Query() search?: string,
    @Query() startDate?: string,
    @Query()endDate?: string,
    @Query() vendor?: number
  ) {
    if (
      orderByColumn !== 'last_transaction_date' &&
          orderByColumn !== undefined
    ) {
      orderByColumn = `${String( orderByColumn )}`
    }
    if ( orderByColumn === undefined ) {
      orderByColumn = 'id'
    }
    const { product, count } = await getAllProductsService(
      OffsetFromPage( page, limit ),
      limit,
      orderByColumn,
      Order,
      search,
      vendor,
      startDate,
      endDate
    )

    return makeResponse.successWithPagination( {
      data     : product,
      totalData: count,
      page     : page,
      limit    : limit,
      totalPage: TotalPage( count, limit ),
      stat_msg : 'SUCCESS'
    } )
  }

  @Post( '/' )
  @Security( 'api_key', ['create:product'] )
  public async createProduct ( @Body() payload: ProductRequestParameter[] ) {
    try {
      return await createProductService( payload )
    } catch ( error ) {
      return error
    }
  }

  @Put( '/' )
  @Security( 'api_key', ['update:product'] )
  public async updateProduct ( @Path( 'id' ) id: string, @Body() payload: UpdateProductParameter ) {
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

  @Post( '/add-campur' )
  @Security( 'api_key', ['create:product'] )
  public async createMixedProduct ( @Body() payload: MixedProductRequestParameter ) {
    try {
      const addCampur = await addMixedProductService( payload )
      return makeResponse.success( { data: addCampur, stat_code: 200 } )
    } catch ( error ) {
      return error
    }
  }
}
