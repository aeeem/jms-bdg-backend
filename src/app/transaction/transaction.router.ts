import { Transaction } from "@entity/transaction";
import { Body, Controller, Delete, Get, Post, Put, Query, Route, Security, Tags } from "tsoa";
import { TransactionRequestParameter, Transactionss } from "./transaction.interface";
import { createTransactionService, deleteTransactionService, getAllTransactionService, searchTransactionService } from "./transaction.service";


@Tags('Transaction')
@Route('/api/transaction')
@Security('api_key')
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