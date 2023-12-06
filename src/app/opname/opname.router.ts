import makeResponse from 'src/helper/response'
import {
  Body, Controller, Get, Post, Request, Route, Security, Tags
} from 'tsoa'
import { getAllOpnameService, opnameStockService } from './opaname.service'
import { StockOpnameParameter } from './opname.interface'

@Tags( 'Opname' )
@Route( '/api/opname' )
@Security( 'api_key' )
export class OpnameController extends Controller {
  @Get( '/' )
  @Security( 'api_key', ['read:stock'] )
  public async getAllOpnames () {
    try {
      const data = await getAllOpnameService()
      return makeResponse.success( { data } )
    } catch ( error ) {
      return error
    }
  }

  @Post( '/opname' )
  @Security( 'api_key', ['update:stock'] )
  public async opnameStock ( @Body() body: StockOpnameParameter[], @Request() request: any ) {
    try {
      const stocks = await opnameStockService( body, request.loggedInUser.id )
      return makeResponse.success( { data: [] } )
    } catch ( error ) {
      return error
    }
  }
}
