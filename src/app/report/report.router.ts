import dayjs from 'dayjs'
import { DateFormat } from 'src/constants/date'
import makeResponse from 'src/helper/response'
import {
  Controller, Get, Query, Route, Security, Tags
} from 'tsoa'
import { getCashFlowService } from '../cashflow/cashflow.service'
import {
  getCashReportService, getDailyReportService, getVendorReportService
} from './report.service'

@Tags( 'Report' )
@Route( '/api/report' )
export class ReportController extends Controller {
  @Security( 'api_key' )
  @Get( '/daily' )
  public async getDailyReport ( @Query() date_param?: string, @Query() type_cash?: string ) {
    try {
      const date = date_param ? dayjs( date_param, DateFormat ) : dayjs()
      
      const data = await getDailyReportService( date, type_cash )
      return makeResponse.success( { data } )
    } catch ( error ) {
      console.log( error )
      return error
    }
  }

  @Security( 'api_key' )
  @Get( '/cash-flow' )
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

  @Security( 'api_key' )
  @Get( '/cash-report' )
  public async getCashReport () {
    try {
      const data = await getCashReportService()
      return makeResponse.success( { data } )
    } catch ( error ) {
      return error
    }
  }

  @Security( 'api_key' )
  @Get( '/supplier' )
  public async getSupplierReport (
  @Query() month?: number
  ) {
    try {
      const monthParam = month ?? dayjs().month()
      const data = await getVendorReportService( monthParam )
      return makeResponse.success( { data } )
    } catch ( error ) {
      return error
    }
  }
}
