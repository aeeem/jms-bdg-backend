import {
  Body, Controller, Delete, Get, Patch, Path, Put, Query, Route, Security, Tags
} from 'tsoa'
import { StockRequestParameter } from './stock.interfaces'
import {
  findStockService, getAllStocksService, updateStockService
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

  @Put( '/{id}' )
  @Security( 'api_key', ['update:stock'] )
  public async updateStock ( @Path() id: string, @Body() body: StockRequestParameter ) {
    return await updateStockService( body, id )
  }

  @Delete( '/{id}/' )
  @Security( 'api_key', ['delete:stock'] )
  public async deleteStock ( @Query( 'id' ) id: string ) {
  }

  @Patch( '/{id}/' )
  @Security( 'api_key', ['update:stock'] )
  public async patchStock ( @Path() id: string, @Body() body: StockRequestParameter ) {
    return await updateStockService( body, id )
  }

  @Get( '/search/:query' )
  @Security( 'api_key', ['read:stock'] )
  public async findStock ( @Query( 'query' ) query: string ) {
    return await findStockService( query )
  }
}
