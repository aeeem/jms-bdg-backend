import { Customer } from '@entity/customer'
import { CustomerMonetary } from '@entity/customerMonetary'
import { db } from 'src/app'
import { E_ERROR } from 'src/constants/errorTypes'
import { E_Recievables } from 'src/database/enum/hutangPiutang'
import { Errors } from 'src/errorHandler'
import { E_CODE_KEY as E_MONET_SOURCE } from 'src/interface/AccountCode'
import {
  AddDebtRequestParameter,
  AddDepositRequestParameter, CustomerRequestParameter, CustomerUpdateRequestParameter
} from './customer.interface'
import { CashFlow } from '@entity/cashFlow'
import {
  E_CashFlowCode, E_CashFlowType, E_CashType
} from 'src/database/enum/cashFlow'

export const getAllCustomerService = async ( offset: number, limit: number, orderByColumn: string, Order?: string, search?: string ) => {
  try {
    //     LEFT JOIN (select  sum(
    // case
    // when "customer_monetary"."type"='DEBT' then "customer_monetary"."amount"
    // else 0
    // end) as "debt",customer_monetary.customer_id from "customer_monetary" group by customer_monetary.customer_id
    // )
    let queryBuilder = await Customer.getRepository()
      .createQueryBuilder( 'customer' )
      .select( ['customer.*,coalesce(cm.debt,0) AS debt,coalesce(cm.deposit,0) AS deposit'] )
      .leftJoin(
        selecQueryBuilder =>
          selecQueryBuilder
            .select( [
              `sum( case
        when ("customer_monetary"."type"='DEBT' AND "customer_monetary"."source"='DEBT_ADD_INSUFFICIENT_FUND')
        then "customer_monetary"."amount"
        when (
        "customer_monetary"."source"='DEBT_SUB_PAY_WITH_CASH' 
        OR "customer_monetary"."source"='DEBT_SUB_PAY_WITH_TRANSFER'
        OR "customer_monetary"."source"='DEBT_SUB_RETURN_GOODS'
        OR "customer_monetary"."source"='DEBT_SUB_PAY_WITH_CHANGE'
        OR  "customer_monetary"."source"='DEP_SUB_PAID_DEBT_WITH_DEPOSIT'
            ) then ("customer_monetary"."amount" * -1)
        else 0
        end)   as "debt", "customer_monetary"."customer_id" as customer_id,  sum( case
   when ("customer_monetary"."type"='DEPOSIT')
   then "customer_monetary"."amount"
   when (
   "customer_monetary"."source"='DEP_SUB_PAID_WITH_DEPOSIT' 
   OR "customer_monetary"."source"='DEP_SUB_PAID_DEBT_WITH_DEPOSIT'
       ) then ("customer_monetary"."amount" * -1)
   else 0
   end)   as "deposit"`
            ] )
            .from( 'customer_monetary', 'customer_monetary' )
            .groupBy( 'customer_monetary.customer_id' ),
        'cm',
        'cm.customer_id = customer.id'
      )

      .leftJoin( 'customer_monetary', 'c1', 'c1.customer_id = customer.id' )
      .leftJoin(
        'customer_monetary',
        'c2',
        'c2.customer_id = customer.id AND (c1.created_at < c2.created_at OR (c1.created_at = c2.created_at AND c1.id < c2.id))'
      )
      .where( 'c2.id IS NULL' )
      .addSelect( 'c1.created_at', 'last_transaction_date' )
      .orderBy( orderByColumn, Order === 'DESC' ? 'DESC' : 'ASC' )
      .offset( offset )
    if ( search ) {
      queryBuilder = queryBuilder.andWhere( 'customer.name ILIKE :search', { search: `%${search}%` } )
    }

    const count_data = await Customer.count()
    queryBuilder = queryBuilder.limit( limit )
    const customers = await queryBuilder.getRawMany()
    
    return {
      count_data,
      customers
    }
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const getCustomerByIdService = async ( id: number ) => {
  try {
    const queryBuilder = await Customer.getRepository()
      .createQueryBuilder( 'customer' )
      .select( ['customer.*,coalesce(0,cm.debt) AS debt,coalesce(0,cm.deposit) AS deposit'] )
      .leftJoin(
        selecQueryBuilder =>
          selecQueryBuilder
            .select( [
              //  sum of debt where debt source is DEBT_ADD_INSUFFICIENT_FUND and type is DEBT
              //  if type debt and source was other than DEBT_ADD_INSUFFICIENT_FUND it will give negative amount
              `sum( case
        when ("customer_monetary"."type"='DEBT' AND "customer_monetary"."source"='DEBT_ADD_INSUFFICIENT_FUND')
        then "customer_monetary"."amount"
        when (
        "customer_monetary"."source"='DEBT_SUB_PAY_WITH_CASH' 
        OR "customer_monetary"."source"='DEP_SUB_PAID_DEBT_WITH_DEPOSIT'
        OR "customer_monetary"."source"='DEBT_SUB_PAY_WITH_CASH'
        OR "customer_monetary"."source"='DEBT_SUB_PAY_WITH_TRANSFER'
        OR "customer_monetary"."source"='DEBT_SUB_RETURN_GOODS'
        OR "customer_monetary"."source"='DEBT_SUB_PAY_WITH_CHANGE'
        OR  "customer_monetary"."source"='DEP_SUB_PAID_DEBT_WITH_DEPOSIT'
            ) then ("customer_monetary"."amount" * -1)
        else 0
        end)   as "debt", "customer_monetary"."customer_id" as customer_id, sum( case
        when "customer_monetary"."type"='DEPOSIT'  then "customer_monetary"."amount"
        else 0
        end) as "deposit"`
            ] )
            .from( 'customer_monetary', 'customer_monetary' )
            .groupBy( 'customer_monetary.customer_id' ),
        'cm',
        'cm.customer_id = customer.id'
      )

      .leftJoin( 'customer_monetary', 'c1', 'c1.customer_id = customer.id' )
      .leftJoin(
        'customer_monetary',
        'c2',
        'c2.customer_id = customer.id AND (c1.created_at < c2.created_at OR (c1.created_at = c2.created_at AND c1.id < c2.id))'
      )
      .where( 'c2.id IS NULL' )
      .addSelect( 'c1.created_at', 'last_transaction_date' )
      .where( 'customer.id=:id', { id } )
    console.log( queryBuilder.getSql() )
    const customer = await queryBuilder.getRawOne()
    
    if ( customer == null ) throw E_ERROR.CUSTOMER_NOT_FOUND
    return customer
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const getCustomerDepositService = async (
  id: number,
  orderByColumn?: string,
  Order?: string,
  offset?: number,
  limit?: number
) => {
  try {
    if (
      orderByColumn !== 'last_transaction_date' &&
          orderByColumn !== undefined
    ) {
      orderByColumn = `customer_monetary.${String( orderByColumn )}`
    }
    if ( orderByColumn === undefined ) {
      orderByColumn = 'customer_monetary.id'
    }
    let queryBuilder = await CustomerMonetary.createQueryBuilder(
      'customer_monetary'
    )
      .select( ['customer_monetary.*'] )
      .where( 'customer_monetary.customer_id=:id', { id } )
      .andWhere( 'customer_monetary.type=:type', { type: E_Recievables.DEPOSIT } )
      .orderBy( orderByColumn, Order === 'DESC' ? 'DESC' : 'ASC' )
    const qb_deposit = await CustomerMonetary.createQueryBuilder(
      'customer_monetary'
    )
      .select( [`coalesce(sum( case
   when ("customer_monetary"."type"='DEPOSIT')
   then "customer_monetary"."amount"
   when (
   "customer_monetary"."source"='DEP_SUB_PAID_WITH_DEPOSIT' 
   OR "customer_monetary"."source"='DEP_SUB_PAID_DEBT_WITH_DEPOSIT'
       ) then ("customer_monetary"."amount" * -1)
   else 0
   end) ,0)  as "total_deposit"`] )
      .where( 'customer_monetary.customer_id=:id', { id } )
      .andWhere( 'customer_monetary.type=:type', { type: E_Recievables.DEPOSIT } )

    const total_deposit_obj = await qb_deposit.getRawOne()
    const count_data = await queryBuilder.getCount()
    // If a limit is provided, set the maximum number of records to retrieve
    if ( limit ) {
      queryBuilder = queryBuilder.limit( limit )
    }
    // If a offset is provided, set the maximum number of records to retrieve
    if ( offset ) {
      queryBuilder = queryBuilder.offset( offset )
    }
    const total_deposit: number = total_deposit_obj.total_deposit
    const customer_deposit_list = await queryBuilder.getRawMany()
    return {
      count_data,
      total_deposit,
      customer_deposit_list
    }
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const getCustomerDebtService = async (
  id: number,
  orderByColumn?: string,
  Order?: string,
  offset?: number,
  limit?: number
) => {
  try {
    if (
      orderByColumn !== 'last_transaction_date' &&
            orderByColumn !== undefined
    ) {
      orderByColumn = `customer_monetary.${String( orderByColumn )}`
    }
    if ( orderByColumn === undefined ) {
      orderByColumn = 'customer_monetary.id'
    }
    let queryBuilder = await CustomerMonetary.createQueryBuilder(
      'customer_monetary'
    )
      .select( ['customer_monetary.*'] )
      .where( 'customer_monetary.customer_id=:id', { id } )
      .orderBy( orderByColumn, Order === 'DESC' ? 'DESC' : 'ASC' )
      .andWhere( 'customer_monetary.type=:type', { type: E_Recievables.DEBT } )

    const total_debt_obj = await CustomerMonetary.createQueryBuilder(
      'customer_monetary'
    )
      .select( [
        ` sum( case
        when ("customer_monetary"."type"='DEBT' AND "customer_monetary"."source"='DEBT_ADD_INSUFFICIENT_FUND')
        then "customer_monetary"."amount"
        when (
        "customer_monetary"."source"='DEBT_SUB_PAY_WITH_CASH' 
        OR "customer_monetary"."source"='DEBT_SUB_PAY_WITH_TRANSFER'
        OR "customer_monetary"."source"='DEBT_SUB_RETURN_GOODS'
        OR "customer_monetary"."source"='DEBT_SUB_PAY_WITH_CHANGE'
        OR  "customer_monetary"."source"='DEP_SUB_PAID_DEBT_WITH_DEPOSIT'
            ) then ("customer_monetary"."amount" * -1)
        else 0
        end)   as "total_debt"`
      ] )
      .where( 'customer_monetary.customer_id=:id', { id } )
      .andWhere( 'customer_monetary.type=:type', { type: E_Recievables.DEBT } )
      .getRawOne()

    const count_data = await queryBuilder.getCount()
    // If a limit is provided, set the maximum number of records to retrieve
    if ( limit ) {
      queryBuilder = queryBuilder.limit( limit )
    }
    // If a offset is provided, set the maximum number of records to retrieve
    if ( offset ) {
      queryBuilder = queryBuilder.offset( offset )
    }
    const total_debt: number = total_debt_obj.total_debt
    const customer_debt_list = await queryBuilder.getRawMany()
    return {
      count_data,
      total_debt,
      customer_debt_list
    }
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const addDepositService = async ( {
  amount, customer_id, is_transfer, description
}: AddDepositRequestParameter ) => {
  try {
    const customer = await Customer.findOne( { where: { id: customer_id } } )
    if ( !customer ) throw E_ERROR.CUSTOMER_NOT_FOUND
    const customerMonetary = new CustomerMonetary()
    customerMonetary.customer_id = customer.id
    customerMonetary.amount = amount
    customerMonetary.type = E_Recievables.DEPOSIT
    customerMonetary.source = is_transfer ? E_MONET_SOURCE.DEP_ADD_CASH_DEPOSIT_TRANSFER : E_MONET_SOURCE.DEP_ADD_CASH_DEPOSIT
    if ( description ) {
      customerMonetary.description = description
    }
    await customerMonetary.save()

    const cashFlow = new CashFlow()
    cashFlow.amount = amount
    cashFlow.code = E_CashFlowCode.IN_ADD_DEPOSIT
    cashFlow.type = E_CashFlowType.CashIn
    cashFlow.cash_type = is_transfer ? E_CashType.TRANSFER : E_CashType.CASH
    cashFlow.note = `${customer.name} Tambah Deposit` // temporary harcode

    return customerMonetary
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const payDebtService = async ( {
  amount, customer_id, is_transfer, description
}: AddDebtRequestParameter ) => {
  try {
    const customer = await Customer.findOne( { where: { id: customer_id } } )
    if ( !customer ) throw E_ERROR.CUSTOMER_NOT_FOUND
    const customerMonetary = new CustomerMonetary()
    customerMonetary.customer_id = customer.id
    customerMonetary.amount = amount
    customerMonetary.type = E_Recievables.DEBT
    customerMonetary.source = is_transfer ? E_MONET_SOURCE.DEBT_SUB_PAY_WITH_TRANSFER : E_MONET_SOURCE.DEBT_SUB_PAY_WITH_CASH
    if ( description ) {
      customerMonetary.description = description
    }
    await customerMonetary.save()

    const cashFlow = new CashFlow()
    cashFlow.amount = amount
    cashFlow.code = E_CashFlowCode.IN_PAY_DEBT
    cashFlow.type = E_CashFlowType.CashIn
    cashFlow.cash_type = is_transfer ? E_CashType.TRANSFER : E_CashType.CASH
    cashFlow.note = `Pembayaran Hutang : ${customer.name}` // temporary harcode
    cashFlow.customer = customer
    await cashFlow.save()

    return customerMonetary
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const searchCustomerService = async ( query: string ) => {
  try {
    const customer = await Customer.createQueryBuilder( 'customer' )
      .where( 'UPPER(customer.name) LIKE UPPER(:query)', { query: `%${query}%` } )
      .leftJoinAndSelect( 'customer.monetary', 'monetary' )
      .leftJoinAndSelect( 'customer.transactions', 'transactions' )
      .orderBy( 'customer.id', 'ASC' )
      .getMany()
    return customer
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const createCustomerService = async ( payload: CustomerRequestParameter ) => {
  const queryRunner = db.queryRunner()
  try {
    await queryRunner.startTransaction()
    const _newCustomer = new Customer()
    _newCustomer.name = payload.name
    _newCustomer.contact_number = payload.contact_number ?? ''
    await queryRunner.manager.save( _newCustomer )

    const _customerMonet = new CustomerMonetary()
    _customerMonet.customer = _newCustomer
    // if ( payload.hutang ) {
    //   _customerMonet.amount = payload.hutang
    //   _customerMonet.type = E_Recievables.DEBT
    // } else if ( payload.piutang ) {
    //   _customerMonet.amount = payload.piutang
    //   _customerMonet.type = E_Recievables.DEPOSIT
    // }
    // if ( payload.hutang ?? payload.piutang ) {
    //   await queryRunner.manager.save( _customerMonet )
    // }
    await queryRunner.commitTransaction()
    const customer = await Customer.findOne( { where: { id: _newCustomer.id } } )
    return customer
  } catch ( error: any ) {
    await queryRunner.rollbackTransaction()
    return await Promise.reject( new Errors( error ) )
  } finally {
    await queryRunner.release()
  }
}

export const updateCustomerService = async ( id: string, payload: CustomerUpdateRequestParameter ) => {
  try {
    const customer = await Customer.findOne( { where: { id } } )
    if ( customer != null ) {
      customer.name = payload.name ? payload.name : customer.name
      customer.contact_number = payload.contact_number ? payload.contact_number : customer.contact_number
      await customer.save()
    } else throw E_ERROR.CUSTOMER_NOT_FOUND
    return await Customer.findOne( { where: { id } } )
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const deleteCustomerService = async ( id: string ) => {
  try {
    const customer = await Customer.findOne( { where: { id } } )
    if ( customer != null ) {
      await customer.remove()
    } else throw E_ERROR.CUSTOMER_NOT_FOUND
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}
