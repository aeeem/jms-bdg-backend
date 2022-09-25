import makeResponse from 'src/helper/response'
import {
  Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, Tags
} from 'tsoa'
import { TransactionRequestParameter, TransactionUpdateRequestParameter } from './transaction.interface'
import {
  createTransactionService, deleteTransactionService, getAllTransactionService, getTransactionByIdService, searchTransactionService, updateTransactionService
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

  @Get( '/search/' )
  @Security( 'api_key', ['read:transaction'] )
  public async searchTransaction ( @Query( 'query' ) query?: string, @Query( 'id' ) id?: string ) {
    try {
      const transactions = await searchTransactionService( query, id )
      return makeResponse.success( { data: transactions } )
    } catch ( error ) {
      console.log( error )
      return error
    }
  }

  @Get( '/{id}' )
  @Security( 'api_key', ['read:transaction'] )
  public async getTransactionById ( @Path( 'id' ) id: string ) {
    try {
      const transaction = await getTransactionByIdService( id )
      return makeResponse.success( { data: transaction } )
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
      console.log( error )
      return error
    }
  }
  
  @Put( '/{id}/' )
  @Security( 'api_key', ['update:transaction'] )
  public async updateTransaction ( @Path( 'id' ) id: string, @Body() payload: TransactionUpdateRequestParameter ) {
    try {
      const updatedTransaction = await updateTransactionService( id, payload )
      return makeResponse.success( { data: updatedTransaction } )
    } catch ( error ) {
      return error
    }
  }

  @Delete( '/{id}/' )
  @Security( 'api_key', ['delete:transaction'] )
  public async deleteTransaction ( @Path( 'id' ) id: string ) {
    try {
      return await deleteTransactionService( id )
    } catch ( error ) {
      return error
    }
  }
}
