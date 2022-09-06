import {
  Controller, Get, Route, Tags
} from 'tsoa'

@Tags( 'Statistic' )
@Route( '/api/statistic' )
export class StatisticController extends Controller {
  @Get( '/dashboard' )
  public async getDashboardStats () {
    
  }
}
