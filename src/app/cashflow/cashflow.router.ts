import makeResponse from 'src/helper/response'
import {
  Body,
  Controller, Post, Route, Security, Tags
} from 'tsoa'
import { CreateCashRequestBody } from './cashflow.interfaces'
import { createCashInService, createCashOutService } from './cashflow.service'

@Tags( 'Cashflow' )
@Route( '/api/cash-flow' )
export class CashFlowController extends Controller {
  @Security( 'api_key' )
  @Post( '/cash-out' )
  public async createCashOut ( @Body() body: CreateCashRequestBody ) {
    try {
      const data = await createCashOutService( body )
      return makeResponse.success( { data } )
    } catch ( error ) {
      return error
    }
  }

  @Security( 'api_key' )
  @Post( '/cash-in' )
  public async createCashIn ( @Body() body: CreateCashRequestBody ) {
    try {
      const data = await createCashInService( body )
      return makeResponse.success( { data } )
    } catch ( error ) {
      return error
    }
  }
}
