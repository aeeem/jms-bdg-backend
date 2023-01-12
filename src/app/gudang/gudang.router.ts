import makeResponse from 'src/helper/response'
import {
  Body,
  Controller, Get, Post, Route, Security, Tags
} from 'tsoa'
import { PindahStockGudangRequestParameter, TambahStockGudangRequestParameter } from './gudang.interface'
import { getStockGudangService, pindahStockGudangService } from './gudang.service'

@Tags( 'Gudang' )
@Route( '/api/gudang' )
@Security( 'api_key' )
export class GudangController extends Controller {
  @Get( '/' )
  @Security( 'api_key', ['read:gudang'] )
  public async getStockGudang () {
    try {
      const stocks = await getStockGudangService()
      return makeResponse.success( { data: stocks } )
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }
  
  @Post( '/pindah-stok' )
  @Security( 'api_key', ['update:gudang'] )
  public async pindahStockGudang ( @Body() payload: PindahStockGudangRequestParameter[] ) {
    try {
      const stocks = await pindahStockGudangService( payload )
      return makeResponse.success( { data: stocks } )
    } catch ( error: any ) {
      return await Promise.reject( error )
    }
  }

  @Post( '/' )
  @Security( 'api_key', ['create:gudang'] )
  public async tambahStockGudang ( @Body() payload: TambahStockGudangRequestParameter ) {
    try {
      // const stocks = await tambahStockGudangService( payload )
      // return makeResponse.success( { data: stocks } )
    } catch ( error ) {
      return error
    }
  }
}
