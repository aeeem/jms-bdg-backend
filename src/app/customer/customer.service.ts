import { Customer } from '@entity/customer'
import { CustomerMonetary } from '@entity/customerMonetary'
import { db } from 'src/app'
import { E_ERROR } from 'src/constants/errorTypes'
import { E_Recievables } from 'src/database/enum/hutangPiutang'
import { Errors } from 'src/errorHandler'
import { CalculateTotalBalance } from 'src/helper/monetaryHelper'
import { E_CODE_KEY as E_MONET_SOURCE } from 'src/interface/AccountCode'
import {
  AddDebtRequestParameter,
  AddDepositRequestParameter, CustomerRequestParameter, CustomerUpdateRequestParameter
} from './customer.interface'

export const getAllCustomerService = async () => {
  try {
    return await Customer.find( { relations: ['transactions', 'monetary'] } )
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const getCustomerByIdService = async ( id: number ) => {
  try {
    const customer = await Customer.findOne( {
      where    : { id },
      relations: ['transactions', 'monetary']
    } )
    if ( customer == null ) throw E_ERROR.CUSTOMER_NOT_FOUND
    return customer
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const getCustomerDepositService = async ( id: number ) => {
  try {
    const customer_deposit = await CustomerMonetary.find( { where: { customer_id: id, type: E_Recievables.DEPOSIT } } )
    const total_deposit = CalculateTotalBalance( customer_deposit )
    return {
      total_deposit,
      deposits: customer_deposit
    }
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const getCustomerDebtService = async ( id: number ) => {
  try {
    const customer_debt = await CustomerMonetary.find( { where: { customer_id: id, type: E_Recievables.DEBT } } )
    const total_debt = CalculateTotalBalance( customer_debt )
    return {
      total_debt,
      debts: customer_debt
    }
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const addDepositService = async ( { amount, customer_id }: AddDepositRequestParameter ) => {
  try {
    const customer = await Customer.findOne( { where: { id: customer_id } } )
    if ( !customer ) throw E_ERROR.CUSTOMER_NOT_FOUND
    const customerMonetary = new CustomerMonetary()
    customerMonetary.customer_id = customer.id
    customerMonetary.amount = amount
    customerMonetary.type = E_Recievables.DEPOSIT
    customerMonetary.source = E_MONET_SOURCE.DEP_ADD_CASH_DEPOSIT
    await customerMonetary.save()
    return customerMonetary
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const payDebtService = async ( { amount, customer_id }: AddDebtRequestParameter ) => {
  try {
    const customer = await Customer.findOne( { where: { id: customer_id } } )
    if ( !customer ) throw E_ERROR.CUSTOMER_NOT_FOUND
    const customerMonetary = new CustomerMonetary()
    customerMonetary.customer_id = customer.id
    customerMonetary.amount = amount
    customerMonetary.type = E_Recievables.DEBT
    customerMonetary.source = E_MONET_SOURCE.DEBT_SUB_PAY_WITH_CASH
    await customerMonetary.save()
    return customerMonetary
  } catch (error:any) {
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
    _newCustomer.contact_number = payload.contact_number
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
