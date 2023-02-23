import dayjs from 'dayjs'
import { DateFormat } from 'src/constants/date'
import makeResponse from 'src/helper/response'
import {
  Controller, Get, Query, Route, Security, Tags
} from 'tsoa'
import { getDailyReportService } from './report.service'

@Tags( 'Report' )
@Route( '/api/report' )
export class ReportController extends Controller {
  @Security( 'api_key' )
  @Get( '/daily' )
  public async getDailyReport ( @Query() date_param?: string ) {
    try {
      const date = date_param ? dayjs( date_param, DateFormat ) : dayjs()
      const data = await getDailyReportService( date )
      return makeResponse.success( { data } )
    } catch ( error ) {
      return error
    }
  }
}
