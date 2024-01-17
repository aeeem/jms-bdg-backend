import {
  Controller, Get, Route, Tags
} from 'tsoa'
import { getDashboardStatsService } from './statistic.service'

@Tags( 'Statistic' )
@Route( '/api/statistic' )
export class StatisticController extends Controller {
  @Get( '/dashboard' )
  public async getDashboardStats () {
    return await getDashboardStatsService()
  }
}
