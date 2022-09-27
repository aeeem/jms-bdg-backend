import {
  Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, Tags
} from 'tsoa'
import {
  payDebtService,
  addDepositService,
  createCustomerService, deleteCustomerService, getAllCustomerService, getCustomerByIdService, getCustomerDebtService, getCustomerDepositService, searchCustomerService, updateCustomerService
} from './customer.service'
import {
  AddDepositRequestParameter, CustomerRequestParameter, CustomerUpdateRequestParameter
} from './customer.interface'
import makeResponse from 'src/helper/response'

@Tags( 'Customer' )
@Route( '/api/customer' )

export class CustomerController extends Controller {
  @Get( '/' )
  @Security( 'api_key', ['read:customer'] )
  public async getAllCustomer () {
    try {
      const customer = await getAllCustomerService()
      return makeResponse.success( { data: customer } )
    } catch ( error: any ) {
      return error
    }
  }

  @Get( '/detail/{id}' )
  @Security( 'api_key', ['read:customer'] )
  public async findCustomerById ( @Path() id: string ) {
    try {
      const customer = await getCustomerByIdService( + id )
      return makeResponse.success( { data: customer } )
    } catch ( error: any ) {
      return error
    }
  }

  @Get( '/search/' )
  @Security( 'api_key', ['read:customer'] )
  public async searchCustomer ( @Query( 'query' ) query: string ) {
    try {
      const customer = await searchCustomerService( query )
      return makeResponse.success( { data: customer } )
    } catch ( error: any ) {
      return error
    }
  }

  @Get( '/deposit/{id}/' )
  @Security( 'api_key', ['read:customer'] )
  public async getDeposit ( @Path() id: string ) {
    try {
      const customer = await getCustomerDepositService( + id )
      return makeResponse.success( { data: customer } )
    } catch ( error: any ) {
      return error
    }
  }

  @Post( '/deposit/' )
  @Security( 'api_key', ['create:customer'] )
  public async addDeposit ( @Body() payload: AddDepositRequestParameter ) {
    try {
      const customer = await addDepositService( payload )
      return makeResponse.success( { data: customer } )
    } catch ( error: any ) {
      return error
    }
  }


  @Post( '/debt/pay' )
  @Security( 'api_key', ['create:customer'] )
  public async payDebt ( @Body() payload: AddDepositRequestParameter ) {
    try {
      const customer = await payDebtService( payload )
      return makeResponse.success( { data: customer } )
    } catch ( error: any ) {
      return error
    }
  }

  @Get( '/debt/{id}/' )
  @Security( 'api_key', ['read:customer'] )
  public async getDebt ( @Path() id: string ) {
    try {
      const customerDebt = await getCustomerDebtService( + id )
      return makeResponse.success( { data: customerDebt } )
    } catch ( error ) {
      return error
    }
  }

  @Post( '/' )
  @Security( 'api_key', ['create:customer'] )
  public async createCustomer ( @Body() payload: CustomerRequestParameter ) {
    try {
      const customer = await createCustomerService( payload )
      return makeResponse.success( { data: customer } )
    } catch ( error ) {
      return error
    }
  }

  @Put( '/{id}/' )
  @Security( 'api_key', ['update:customer'] )
  public async updateCustomer ( @Path() id: string, @Body() payload: CustomerUpdateRequestParameter ) {
    try {
      const customer = await updateCustomerService( id, payload )
      return makeResponse.success( { data: customer } )
    } catch ( error: any ) {
      return error
    }
  }

  @Delete( '/{id}/' )
  @Security( 'api_key', ['delete:customer'] )
  public async deleteCustomer ( @Path() id: string ) {
    try {
      await deleteCustomerService( id )
      return makeResponse.success( { data: {} } )
    } catch ( error: any ) {
      return error
    }
  }
}
