import makeResponse from 'src/helper/response'
import {
  Controller, Get, Query, Route, Security, Tags
} from 'tsoa'
import { getCashFlowService } from './cashflow.service'

@Tags( 'Cashflow' )
@Route( '/api/cash-flow' )
export class CashFlowController extends Controller {
  @Security( 'api_key' )
  @Get( '/' )
  public async getCashFlow (
  @Query() year: number,
    @Query() month?: number,
    @Query() week?: number
  ) {
    try {
      const data = await getCashFlowService( year, month, week )
      return makeResponse.success( { data } )
    } catch ( error ) {
      return error
    }
  }
}
