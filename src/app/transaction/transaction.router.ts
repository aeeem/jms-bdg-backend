import makeResponse, { OffsetFromPage, TotalPage } from 'src/helper/response'
import {
  Body, Controller, Delete, Get, Patch, Path, Post, Put, Query, Request, Route, Security, Tags
} from 'tsoa'
import {
  DeleteTransactionItemRequestParameter, TransactionPendingUpdateRequestParameter, TransactionRequestParameter, TransactionUpdateRequestParameter
} from './transaction.interface'
import {
  createTransactionService, deletePendingTransactionItemService, deletePendingTransactionService, deleteTransactionService, getAllTransactionService, getTransactionByIdService, searchTransactionService, updatePendingTransactionService, updateTransactionService
} from './transaction.service'
import { RequestWithUser } from 'src/auth'

@Tags( 'Transaction' )
@Route( '/api/transaction' )
@Security( 'api_key' )
export class TransactionController extends Controller {
  @Get( '/' )
  @Security( 'api_key', ['read:transaction'] )
  public async getAllTransaction (
  @Query() page: number,
    @Query() limit: number,
    @Query() orderByColumn?: string,
    @Query() Order?: string,
    @Query() search?: string,
    @Query() startDate?: string,
    @Query() endDate?: string
  ) {
    try {
      if (
        orderByColumn !== 'created_at' &&
            orderByColumn !== undefined
      ) {
        orderByColumn = `${String( orderByColumn )}`
      }
      if ( orderByColumn === undefined ) {
        orderByColumn = 'id'
      }
      const { transactions, count } = await getAllTransactionService(
        OffsetFromPage( page, limit ),
        limit,
        orderByColumn,
        Order,
        search,
        startDate,
        endDate
      )
      return makeResponse.successWithPagination( {
        data     : transactions,
        totalData: + count | 0,
        page,
        limit,
        totalPage: TotalPage( + count | 0, limit ),
        stat_msg : 'SUCCESS'
      } )
    } catch ( error ) {
      return error
    }
  }

  @Get( '/search/' )
  @Security( 'api_key', ['read:transaction'] )
  public async searchTransaction (
  @Query( 'query' ) query?: string,
    @Query( 'id' ) id?: string
  ) {
    try {
      const transactions = await searchTransactionService( query, id )
      return makeResponse.success( { data: transactions } )
    } catch ( error ) {
      return error
    }
  }

  @Post( '/create' )
  @Security( 'api_key', ['create:transaction'] )
  public async createTransaction (
  @Body() payload: TransactionRequestParameter,
    @Request() request: RequestWithUser
  ) {
    try {
      const user = request.loggedInUser
      const createdTransaction = await createTransactionService(
        payload,
        false,
        user
      )
      return makeResponse.success( { data: createdTransaction } )
    } catch ( error: any ) {
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

  @Post( '/pending' )
  @Security( 'api_key', ['create:transaction'] )
  public async createPendingTransaction (
  @Body() payload: TransactionRequestParameter
  ) {
    try {
      const createdTransaction = await createTransactionService( payload, true )
      return makeResponse.success( { data: createdTransaction } )
    } catch ( error: any ) {
      return error
    }
  }

  @Delete( '/pending/{id}' )
  @Security( 'api_key', ['create:transaction'] )
  public async deletePendingTransaction ( @Path() id: string ) {
    try {
      const deletedTransaction = await deletePendingTransactionService( id )
      return makeResponse.success( { data: deletedTransaction } )
    } catch ( error: any ) {
      return error
    }
  }

  @Put( '/pending/{transaction_id}' )
  @Security( 'api_key', ['update:transaction'] )
  public async updatePendingTransaction (
  @Path() transaction_id: string,
    @Body() payload: TransactionPendingUpdateRequestParameter
  ) {
    try {
      const deletedTransaction = await updatePendingTransactionService(
        transaction_id,
        payload.detail
      )
      return makeResponse.success( { data: deletedTransaction } )
    } catch ( error: any ) {
      return error
    }
  }

  @Patch( '/pending/item' )
  @Security( 'api_key', ['create:transaction'] )
  public async deletePendingTransactionItem (
  @Body() payload: DeleteTransactionItemRequestParameter
  ) {
    try {
      const deletedTransactionItem = await deletePendingTransactionItemService(
        payload
      )
      return makeResponse.success( {
        data    : deletedTransactionItem,
        stat_msg: `Stock pada transaksi id: ${payload.transaction_id}, sudah di hapus`
      } )
    } catch ( error: any ) {
      return error
    }
  }

  @Put( '/{id}/' )
  @Security( 'api_key', ['update:transaction'] )
  public async updateTransaction (
  @Path( 'id' ) id: string,
    @Body() payload: TransactionUpdateRequestParameter
  ) {
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
