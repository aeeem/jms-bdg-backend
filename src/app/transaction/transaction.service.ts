import { Customer } from '@entity/customer'
import { CustomerMonetary } from '@entity/customerMonetary'
import { Product } from '@entity/product'
import { Transaction } from '@entity/transaction'
import { TransactionDetail } from '@entity/transactionDetail'
import _ from 'lodash'
import { db } from 'src/app'
import { E_ERROR } from 'src/constants/errorTypes'
import { TRANSACTION_STATUS } from 'src/constants/languageEnums'
import { E_Recievables } from 'src/database/enum/hutangPiutang'
import { Errors } from 'src/errorHandler'
import { getCustomerDebtService, getCustomerDepositService } from '../customer/customer.service'
import { formatTransaction, TransactionProcessor } from './transaction.helper'
import { TransactionRequestParameter, TransactionUpdateRequestParameter } from './transaction.interface'

export const getAllTransactionService = async () => {
  try {
    const transactions = await Transaction.find( {
      relations: [
        'customer',
        'transactionDetails',
        'transactionDetails.product',
        'transactionDetails.product.stock',
        'transactionDetails.product.stock.vendor'
      ]
    } )
    return formatTransaction( transactions )
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const createTransactionService = async ( payload: TransactionRequestParameter ) => {
  const queryRunner = db.queryRunner()
  try {
    await queryRunner.startTransaction()
    const customer = await Customer.findOne( { where: { id: payload.customer_id } } )
    if ( customer == null ) throw E_ERROR.CUSTOMER_NOT_FOUND
    const customerDeposit = await getCustomerDepositService( customer.id )

    const products = await Product.find( { relations: ['stock'] } )

    let expected_total_price = 0

    const transactionDetails = await Promise.all( payload.detail.map( async transactionDetail => {
      const product = products.find( product => product.id === transactionDetail.productId )
      if ( product == null ) throw E_ERROR.PRODUCT_NOT_FOUND

      expected_total_price += product.stock.sell_price * transactionDetail.amount

      product.stock.total_stock -= transactionDetail.amount
      await queryRunner.manager.save( product )

      const detail = new TransactionDetail()
      detail.amount = transactionDetail.amount
      detail.sub_total = transactionDetail.sub_total
      detail.product_id = transactionDetail.productId

      return detail
    } ) )
    const transactionProcess = new TransactionProcessor(
      payload, customer, transactionDetails, expected_total_price, customerDeposit.total_deposit
    )

    await transactionProcess.start()
    await queryRunner.commitTransaction()

    return {
      ...transactionProcess.transaction,
      customer: {
        ...transactionProcess.transaction.customer,
        deposit_balance: ( await getCustomerDepositService( transactionProcess.transaction.customer.id ) ).total_deposit,
        debt_balance   : ( await getCustomerDebtService( transactionProcess.transaction.customer.id ) ).total_debt
      }
    }
  } catch ( error: any ) {
    await queryRunner.rollbackTransaction()
    return await Promise.reject( new Errors( error ) )
  } finally {
    await queryRunner.release()
  }
}

export const searchTransactionService = async ( query?: string, id?: string ) => {
  try {
    const transactions = await await Transaction.find( {
      relations: [
        'customer',
        'transactionDetails',
        'transactionDetails.product',
        'transactionDetails.product.stock',
        'transactionDetails.product.stock.vendor'
      ],
      where: id ? { id } : {}
    } )
    if ( _.isEmpty( transactions ) ) throw E_ERROR.TRANSACTION_NOT_FOUND
    return transactions
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const updateTransactionService = async ( id: string, payload: TransactionUpdateRequestParameter ) => {
  const queryRunner = db.queryRunner()
  try {
    await queryRunner.startTransaction()
    const transaction = await Transaction.findOne( { where: { id } } )
    const customer = await Customer.findOne( { where: { id: payload.customer_id } } )
    if ( !transaction ) throw E_ERROR.TRANSACTION_NOT_FOUND
    if ( !customer ) throw E_ERROR.CUSTOMER_NOT_FOUND

    let actual_total_price = 0

    transaction.transactionDetails.map( detail => {
      const pd = payload.detail.find( detailPayload => detailPayload.id === detail.id )
      if ( pd ) {
        detail.amount = pd.amount ?? detail.amount
        detail.product_id = pd.productId ?? detail.product_id
        detail.sub_total = pd.sub_total ?? detail.sub_total
        actual_total_price += detail.sub_total
        return detail
      }

      return detail
    } )

    if ( payload.amount_paid && payload.amount_paid < actual_total_price ) {
      transaction.status = TRANSACTION_STATUS.PENDING
      transaction.outstanding_amount = actual_total_price - payload.amount_paid

      // TODO : NEED TO CHECK MONETARY LOGIC
      const customerMonet = new CustomerMonetary()
      customerMonet.customer = customer
      customerMonet.amount = transaction.outstanding_amount
      customerMonet.type = E_Recievables.DEBT
      await queryRunner.manager.save( customerMonet )
    } else {
      transaction.status = TRANSACTION_STATUS.PAID
      transaction.change = payload.amount_paid ? payload.amount_paid - actual_total_price : transaction.change
    }

    transaction.expected_total_price = payload.expected_total_price ?? transaction.expected_total_price
    transaction.actual_total_price = payload.actual_total_price ?? transaction.actual_total_price
    transaction.transaction_date = payload.transaction_date ?? transaction.transaction_date
    transaction.amount_paid = payload.amount_paid ?? transaction.amount_paid
    
    await queryRunner.manager.save( transaction )
    await queryRunner.commitTransaction()
    return await Transaction.findOne( { where: { id } } )
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  } finally {
    await queryRunner.release()
  }
}

export const getTransactionByIdService = async ( id: string ) => {
  try {
    const transaction = await Transaction.findOne( { where: { id }, relations: ['customer', 'transactionDetails'] } )
    if ( !transaction ) throw E_ERROR.TRANSACTION_NOT_FOUND
    return transaction
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const deleteTransactionService = async ( id: string ) => {
  try {
    const transaction = await Transaction.findOneOrFail( { where: { id } } )
    await transaction.remove()
    return { message: 'Transaction is deleted!' }
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}
