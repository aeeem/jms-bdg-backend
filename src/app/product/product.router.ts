import makeResponse, { OffsetFromPage, TotalPage } from 'src/helper/response'
import {
  Body, Controller, Delete, Get, Post, Put, Queries, Query, Route, Security, Tags
} from 'tsoa'
import {
  MixedProductRequestParameter, ProductRequestParameter, UpdateProductParameter
} from './product.interfaces'
import {
  addMixedProductService,
  createProductService, deleteProductService, getAllProductsService, searchProductService, updateProductService
} from './product.service'

interface QueryListParams {
  page: number
  limit: number
  orderByColumn?: string
  Order?: string
  search?: string
}
@Tags( 'Products' )
@Route( '/api/products' )
export class ProductsController extends Controller {
  @Get( '/' )
  @Security( 'api_key', ['read:product'] )
  public async getAllProducts ( @Queries() queries: QueryListParams ) {
    if (
      queries.orderByColumn !== 'last_transaction_date' &&
          queries.orderByColumn !== undefined
    ) {
      queries.orderByColumn = `product.${String( queries.orderByColumn )}`
    }
    if ( queries.orderByColumn === undefined ) {
      queries.orderByColumn = 'product.id'
    }
    const { product, count } = await getAllProductsService(
      OffsetFromPage( queries.page, queries.limit ),
      queries.limit,
      queries.orderByColumn,
      queries.Order,
      queries.search
    )

    return makeResponse.successWithPagination( {
      data     : product,
      totalData: count,
      page     : queries.page,
      limit    : queries.limit,
      totalPage: TotalPage( count, queries.limit ),
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
  public async updateProduct ( @Query( 'id' ) id: string, @Body() payload: UpdateProductParameter ) {
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
