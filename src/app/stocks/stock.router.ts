import { Body, Controller, Delete, Get, Patch, Put, Query, Response, Route, Security, Tags } from "tsoa";
import { StockRequestParameter } from "./stock.interfaces";
import { findStockService, getAllStocksService, updateStockService } from "./stock.service";

@Tags('Stock')
@Route('/api/stock')
@Security('api_key')
export class StockController extends Controller{
  
  @Get('/')
  @Security('api_key',['read:stock'])
  public async getAllStock() {
    return getAllStocksService()
  }

  @Put('/')
  @Security('api_key',['update:stock'])
  public async updateStock(@Body() body : StockRequestParameter) {
    return updateStockService(body)
  }

  @Delete('/{id}/')
  @Security('api_key',['delete:stock'])
  public async deleteStock(@Query('id') id: string) {
  }

  @Patch('/{id}/')
  @Security('api_key',['update:stock'])
  public async patchStock(@Query('id') id: string, @Body() body: StockRequestParameter) {
    return updateStockService(body)
  }

  @Get('/search/:query')
  @Security('api_key',['read:stock'])
  public async findStock(@Query('query') query: string) {
    return findStockService(query)
  }

}