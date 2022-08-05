import { Transaction } from "@entity/transaction";
import { Body, Controller, Delete, Get, Post, Put, Query, Route, Security, Tags } from "tsoa";
import { TransactionRequestParameter, Transactionss } from "./transaction.interface";
import { createTransactionService, deleteTransactionService, getAllTransactionService, searchTransactionService } from "./transaction.service";


@Tags('Transaction')
@Route('/api/transaction')
@Security('api_key')
export class TransactionController extends Controller{
  
  @Get('/')
  @Security('api_key',['read:transaction'])
  public async getAllTransaction() {
    return getAllTransactionService()
  }

  @Post('/')
  @Security('api_key',['create:transaction'])
  public async createTransaction(@Body() payload: TransactionRequestParameter) {
    return createTransactionService(payload);
  }
  
  @Put('/{id}/')
  @Security('api_key',['update:transaction'])
  public async updateTransaction(@Query('id') id: string, @Body() payload: TransactionRequestParameter) {
  }

  @Delete('/{id}/')
  @Security('api_key',['delete:transaction'])
  public async deleteTransaction(@Query('id') id: string) {
    return deleteTransactionService(id);
  }

  @Get('/search/:query')
  @Security('api_key', ['read:transaction'])
  public async searchTransaction(@Query('query') query: string) {
    return searchTransactionService(query);
  }
}