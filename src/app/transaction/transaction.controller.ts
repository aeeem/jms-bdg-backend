import { Body, Controller, Delete, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { TransactionRequestParameter } from "./transaction.interface";
import { createTransactionService, deleteTransactionService, getAllTransactionService, searchTransactionService, updateTransactionService } from "./transaction.service";


@Tags('Transaction')
@Route('/api/transaction')
export class TransactionController extends Controller{
  
  @Get('/')
  public async getAllTransaction() {
    return getAllTransactionService()
  }

  @Post('/')
  public async createTransaction(@Body() payload: TransactionRequestParameter) {
    return createTransactionService(payload);
  }
  
  @Put('/{id}/')
  public async updateTransaction(@Query('id') id: string, @Body() payload: TransactionRequestParameter) {
    return updateTransactionService(id, payload);
  }

  @Delete('/{id}/')
  public async deleteTransaction(@Query('id') id: string) {
    return deleteTransactionService(id);
  }

  @Get('/search/:query')
  public async searchTransaction(@Query('query') query: string) {
    return searchTransactionService(query);
  }
}