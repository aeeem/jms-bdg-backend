import makeResponse from 'src/helper/response'
import {
  Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, Tags
} from 'tsoa'
import { AddStockBulkParameter, UpdateStockParameter } from './stock.interfaces'
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
  public async getAllStock () {
    return await getAllStocksService()
  }

  @Get( '/toko' )
  @Security( 'api_key', ['read:stock'] )
  public async getStockToko () {
    try {
      const stocks = await getStockTokoService()
      return makeResponse.success( { data: stocks } )
    } catch ( error ) {
      return error
    }
  }

  @Put( '/{id}' )
  @Security( 'api_key', ['update:stock'] )
  public async updateStock ( @Path() id: string, @Body() body: {
    is_gudang: boolean
    amountBox: number
    weight: number
  } ) {
    return await updateStockService( body, id )
  }

  @Delete( '/{id}/' )
  @Security( 'api_key', ['delete:stock'] )
  public async deleteStock ( @Query( 'id' ) id: string ) {
  }

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
  public async addStockBulk ( @Path() id: number, @Body() body: AddStockBulkParameter ) {
    return await addStockBulkService( id, body )
  }
}
