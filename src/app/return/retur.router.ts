import {
  Body,
  Controller, Get, Post, Route, Security, Tags
} from 'tsoa'
import { ReturCustomerRequestParameter, ReturRequestParameter } from './retur.interface'
import makeResponse from 'src/helper/response'
import {
  addReturItemCustomerService, addReturItemVendorService, getListReturService
} from './retur.service'
import { Errors } from '../../errorHandler'

@Tags( 'Return' )
@Route( '/api/retur' )

export class ReturController extends Controller {
  @Get( '/' )
  @Security( 'api_key', ['read:stock'] )
  public async getListRetur () {
    try {
      const result = await getListReturService()
      return makeResponse.success( {
        data     : result,
        stat_code: 200
      } )
    } catch ( error: any ) {
      throw new Errors( error )
    }
  }

  @Post( '/vendor' )
  @Security( 'api_key', ['create:stock'] )
  public async addReturItemVendor ( @Body() payload: ReturRequestParameter ) {
    try {
      const result = await addReturItemVendorService( payload )
      return makeResponse.success( {
        data     : result,
        stat_code: 200
      } )
    } catch ( error: any ) {
      throw new Errors( error )
    }
  }

  @Post( '/customer' )
  @Security( 'api_key', ['create:stock'] )
  public async addReturItemCustomer ( @Body() payload: ReturCustomerRequestParameter ) {
    try {
      const result = await addReturItemCustomerService( payload )
      return makeResponse.success( {
        data     : result,
        stat_code: 200,
        stat_msg : 'oyey'
      } )
    } catch ( error: any ) {
      throw new Errors( error )
    }
  }
}
