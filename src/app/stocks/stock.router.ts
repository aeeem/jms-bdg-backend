import makeResponse, { OffsetFromPage, TotalPage } from 'src/helper/response'
import {
  Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, Tags
} from 'tsoa'
import { AddStockBulkParameter } from './stock.interfaces'
import {
  addStockBulkService,
  findStockService, getAllStocksService, getStockTokoService, updateStockService
} from './stock.service'

@Tags( 'Stock' )
@Route( '/api/stock' )
@Security( 'api_key' )
export class StockController extends Controller {
  @Get( '/' )
  @Security( 'api_key', ['read:stock'] )
  public async getAllStock (
  @Query() page: number,
    @Query() limit: number,
    @Query() orderByColumn?: string,
    @Query() Order?: string,
    @Query() search?: string,
    @Query() startDate?: string,
    @Query() endDate?: string,
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
    const { stock, count } = await getAllStocksService( OffsetFromPage( page, limit ), limit, orderByColumn, Order, search, vendor, startDate, endDate )
    return makeResponse.successWithPagination( {
      data     : stock,
      totalData: count,
      page,
      limit,
      totalPage: TotalPage( count, limit ),
      stat_msg : 'SUCCESS'
    } )
  }

  @Get( '/toko' )
  @Security( 'api_key', ['read:stock'] )
  public async getStockToko (
  @Query() page: number,
    @Query() limit: number,
    @Query() orderByColumn?: string,
    @Query() Order?: 'ASC' | 'DESC',
    @Query() search?: string,
    @Query() searchBy?: 'sku' | 'product',
    @Query() stockType?: 'toko' | 'gudang',
    @Query() startDate?: string,
    @Query() endDate?: string,
    @Query() vendor?: number
  ) {
    try {
      if (
        orderByColumn !== 'last_transaction_date' &&
         orderByColumn !== undefined
      ) {
        orderByColumn = `${String( orderByColumn )}`
      }
      if ( orderByColumn === undefined ) {
        orderByColumn = 'id'
      }
      const {stock, count} = await getStockTokoService(
        OffsetFromPage( page, limit ),
        limit,
        orderByColumn,
        searchBy,
        stockType,
        Order,
        search,
        vendor,
        startDate,
        endDate
      )
      return makeResponse.successWithPagination( {
        data     : stock,
        totalData: + count | 0,
        page,
        limit,
        totalPage: TotalPage( + count | 0, limit ),
        stat_msg : 'SUCCESS'
      } )
    } catch ( error ) {
      return error
    }
  }

  @Put( '/{id}' )
  @Security( 'api_key', ['update:stock'] )
  public async updateStock (
  @Path() id: string,
    @Body()
    body: {
      is_gudang: boolean
      amountBox: number
      weight: number
    }
  ) {
    return await updateStockService( body, id )
  }

  @Delete( '/{id}/' )
  @Security( 'api_key', ['delete:stock'] )
  public async deleteStock ( @Query( 'id' ) id: string ) {}

  // @Patch( '/{id}/' )
  // @Security( 'api_key', ['update:stock'] )
  // public async patchStock ( @Path() id: string, @Body() body: StockRequestParameter ) {
  //   return await updateStockService( body, id )
  // }

  @Get( '/search/:query' )
  @Security( 'api_key', ['read:stock'] )
  public async findStock ( @Query( 'query' ) query: string ) {
    return await findStockService( query )
  }

  @Post( '/bulk/{id}' )
  @Security( 'api_key' )
  public async addStockBulk (
  @Path() id: number,
    @Body() body: AddStockBulkParameter
  ) {
    return await addStockBulkService( id, body )
  }
}
