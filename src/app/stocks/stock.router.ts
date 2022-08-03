import { Body, Controller, Delete, Get, Patch, Put, Query, Response, Route, Security, Tags } from "tsoa";
import { StockRequestParameter } from "./stock.interfaces";
import { findStockService, getAllStocksService, updateStockService } from "./stock.service";

@Tags('Stock')
@Route('/api/stock')
@Security('api_key')
export class StockController extends Controller{
  
  @Get('/')
  public async getAllStock() {
    return getAllStocksService()
  }

  @Response(404, 'Stock is not found!')
  @Put('/')
  public async updateStock(@Body() body : StockRequestParameter) {
    return updateStockService(body)
  }

  @Delete('/{id}/')
  public async deleteStock(@Query('id') id: string) {
  }

  @Patch('/{id}/')
  public async patchStock(@Query('id') id: string, @Body() body: StockRequestParameter) {
    return updateStockService(body)
  }

  @Get('/search/:query')
  public async findStock(@Query('query') query: string) {
    return findStockService(query)
  }

}