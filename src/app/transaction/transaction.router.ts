import makeResponse from 'src/helper/response'
import {
  Body, Controller, Delete, Get, Post, Put, Query, Route, Security, Tags
} from 'tsoa'
import { TransactionRequestParameter } from './transaction.interface'
import {
  createTransactionService, deleteTransactionService, getAllTransactionService, searchTransactionService
} from './transaction.service'

@Tags( 'Transaction' )
@Route( '/api/transaction' )
@Security( 'api_key' )
export class TransactionController extends Controller {
  @Get( '/' )
  @Security( 'api_key', ['read:transaction'] )
  public async getAllTransaction () {
    try {
      const transactions = await getAllTransactionService()
      return makeResponse.success( { data: transactions } )
    } catch ( error ) {
      return error
    }
  }

  @Post( '/' )
  @Security( 'api_key', ['create:transaction'] )
  public async createTransaction ( @Body() payload: TransactionRequestParameter ) {
    try {
      const createdTransaction = await createTransactionService( payload )
      return makeResponse.success( { data: createdTransaction } )
    } catch ( error: any ) {
      return error
    }
  }
  
  @Put( '/{id}/' )
  @Security( 'api_key', ['update:transaction'] )
  public async updateTransaction ( @Query( 'id' ) id: string, @Body() payload: TransactionRequestParameter ) {
  }

  @Delete( '/{id}/' )
  @Security( 'api_key', ['delete:transaction'] )
  public async deleteTransaction ( @Query( 'id' ) id: string ) {
    return await deleteTransactionService( id )
  }

  @Get( '/search/:query' )
  @Security( 'api_key', ['read:transaction'] )
  public async searchTransaction ( @Query( 'query' ) query: string ) {
    return await searchTransactionService( query )
  }
}
