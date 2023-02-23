import makeResponse from 'src/helper/response'
import {
  Body,
  Controller, Post, Route, Security, Tags
} from 'tsoa'
import { CreateExpenseRequestBody } from './cashflow.interfaces'
import { createExpenseService } from './cashflow.service'

@Tags( 'Cashflow' )
@Route( '/api/cash-flow' )
export class CashFlowController extends Controller {
  @Security( 'api_key' )
  @Post( '/' )
  public async createExpense ( @Body() body: CreateExpenseRequestBody ) {
    try {
      const data = await createExpenseService( body )
      return makeResponse.success( { data } )
    } catch ( error ) {
      return error
    }
  }
}
