import { Body, Controller, Delete, Get, Patch, Post, Put, Query, Route, Tags } from "tsoa";

@Tags('Stock')
@Route('/api/stock')
export class StockController extends Controller{
  
  @Get('/')
  public async getAllStock() {
    return 'Hello World!';
  }

  @Post('/')
  public async createStock() {
    return 'Hello World!';
  }

  @Put('/{id}/')
  public async updateStock(@Query('id') id: string, @Body() body: { name: string }) {

  }

  @Delete('/{id}/')
  public async deleteStock(@Query('id') id: string) {
  }

  @Patch('/{id}/')
  public async patchStock(@Query('id') id: string, @Body() body: { name: string }) {}

  @Get('/search/:query')
  public async searchStock(@Query('query') query: string) {
    
  }
}