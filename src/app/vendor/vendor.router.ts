import {
  Body, Controller, Delete, Get, Post, Put, Query, Route, Security, Tags
} from 'tsoa'
import { VendorRequestParameter } from './vendor.interfaces'
import {
  addVendorService, deleteVendorService, findVendorService, getAllVendorService, updateVendorService
} from './vendor.service'

@Tags( 'Vendor' )
@Route( '/api/vendor' )
export class VendorController extends Controller {
  @Get( '/' )
  @Security( 'api_key', ['read:vendor'] )
  public async getAllVendor () {
    return await getAllVendorService()
  }

  @Get( '/search/' )
  @Security( 'api_key', ['read:vendor'] )
  public async findVendor ( @Query( 'query' ) query: string ) {
    return await findVendorService( query )
  }

  @Post( '/' )
  @Security( 'api_key', ['create:vendor'] )
  public async addVendor ( @Body() body: VendorRequestParameter ) {
    return await addVendorService( body )
  }
  
  @Put( '/' )
  @Security( 'api_key', ['update:vendor'] )
  public async updateVendor ( @Query( 'id' ) id: string, @Body() body: VendorRequestParameter ) {
    return await updateVendorService( id, body )
  }

  @Delete( '/' )
  @Security( 'api_key', ['delete:vendor'] )
  public async deleteVendor ( @Query( 'id' ) id: string ) {
    return await deleteVendorService( id )
  }
}
