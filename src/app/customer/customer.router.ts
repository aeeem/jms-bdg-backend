import {
  Body, Controller, Delete, Example, Get, Path, Post, Put, Queries, Query, Route, Security, Tags
} from 'tsoa'
import {
  payDebtService,
  addDepositService,
  createCustomerService, deleteCustomerService, getAllCustomerService, getCustomerByIdService, getCustomerDebtService, getCustomerDepositService, searchCustomerService, updateCustomerService
} from './customer.service'
import {
  AddDepositRequestParameter, CustomerRequestParameter, CustomerUpdateRequestParameter
} from './customer.interface'
import makeResponse, { OffsetFromPage, TotalPage } from 'src/helper/response'

interface QueryListParams {
  page: number
  limit: number
  orderByColumn?: string
  Order?: string
  search?: string
}

@Tags( 'Customer' )
@Route( '/api/customer' )
export class CustomerController extends Controller {
  @Get( '/' )
  @Example( {
    data: [
      {
        last_transaction_date: '2025-01-09T21:45:03.679Z',
        id                   : 136,
        name                 : 'Tes',
        contact_number       : '',
        created_at           : '2024-09-20T08:03:39.137Z',
        updated_at           : '2024-09-20T08:03:39.137Z',
        debt                 : '18287450',
        deposit              : '0'
      }
    ],
    page     : 1,
    totalData: 216,
    limit    : 1,
    totalPage: 216,
    stat_code: 200,
    stat_msg : 'SUCCESS'
  } )
  @Security( 'api_key', ['read:customer'] )
  public async getAllCustomer ( @Queries() queries: QueryListParams ) {
    try {
      if (
        queries.orderByColumn !== 'last_transaction_date' &&
        queries.orderByColumn !== undefined
      ) {
        queries.orderByColumn = `customer.${String( queries.orderByColumn )}`
      }
      if ( queries.orderByColumn === undefined ) {
        queries.orderByColumn = 'customer.id'
      }
      const { customers, count_data } = await getAllCustomerService(
        OffsetFromPage( queries.page, queries.limit ),
        queries.limit,
        queries.orderByColumn,
        queries.Order,
        queries.search
      )

      return makeResponse.successWithPagination( {
        data     : customers,
        page     : queries.page,
        totalData: count_data,
        limit    : queries.limit,
        totalPage: TotalPage( count_data, queries.limit ),
        stat_msg : 'SUCCESS'
      } )
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
      return makeResponse.successWithPagination( { data: customer } )
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
  @Example( {
    data: {
      debt: [
        {
          id            : 606,
          type          : 'DEBT',
          amount        : 120000,
          source        : 'DEBT_ADD_INSUFFICIENT_FUND',
          transaction_id: null,
          customer_id   : 136,
          created_at    : '2024-10-07T07:02:07.594Z',
          updated_at    : '2024-10-07T07:02:07.594Z',
          description   : null
        }
      ],
      total_debt: '18287450'
    },
    page     : 1,
    totalData: 13,
    limit    : 10,
    totalPage: 2,
    stat_code: 200,
    stat_msg : 'SUCCESS'
  } )
  public async getDebt (
  @Queries() queries: QueryListParams,
    @Path() id: string
  ) {
    try {
      const {
        count_data, total_debt, customer_debt_list
      } =
        await getCustomerDebtService(
          + id,
          OffsetFromPage( queries.page, queries.limit ),
          queries.limit
        )
   

      return makeResponse.successWithPagination( {
        data: {
          debt: customer_debt_list,
          total_debt
        },
        page     : queries.page,
        totalData: count_data,
        limit    : queries.limit,
        totalPage: TotalPage( count_data, queries.limit ),
        stat_msg : 'SUCCESS'
      } )
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
  public async updateCustomer (
  @Path() id: string,
    @Body() payload: CustomerUpdateRequestParameter
  ) {
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
