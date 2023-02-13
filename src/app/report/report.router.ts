import makeResponse from 'src/helper/response'
import {
  Controller, Get, Route, Security, Tags
} from 'tsoa'
import { getDailyReportService } from './report.service'

@Tags( 'Report' )
@Route( '/api/report' )
export class ReportController extends Controller {
  @Security( 'api_key' )
  @Get( '/daily' )
  public async getDailyReport () {
    try {
      await getDailyReportService()
      return makeResponse.success( { data: 'asd' } )
    } catch ( error ) {
      return error
    }
  }
}
