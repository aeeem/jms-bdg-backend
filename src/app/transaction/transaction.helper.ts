import { Customer } from '@entity/customer'
import { CustomerMonetary } from '@entity/customerMonetary'
import { Transaction } from '@entity/transaction'
import { TransactionDetail } from '@entity/transactionDetail'
import { db } from 'src/app'
import { E_ERROR } from 'src/constants/errorTypes'
import { E_Recievables } from 'src/database/enum/hutangPiutang'
import { E_TransactionStatus } from 'src/database/enum/transaction'
import { E_CODE_KEY } from 'src/interface/AccountCode'
import { TransactionRequestParameter } from './transaction.interface'

export const formatTransaction = ( transactions: Transaction[] ) => {
  return transactions.map( transaction => {
    return {
      id                  : transaction.id,
      expected_total_price: transaction.expected_total_price,
      actual_total_price  : transaction.actual_total_price,
      amount_paid         : transaction.amount_paid,
      change              : transaction.change,
      outstanding_amount  : transaction.outstanding_amount,
      transaction_date    : transaction.transaction_date,
      customer            : {
        id            : transaction.customer.id,
        name          : transaction.customer.name,
        contact_number: transaction.customer.contact_number
      },
      items: transaction.transactionDetails.map( detail => {
        return {
          id     : detail.id,
          amount : detail.amount,
          product: {
            id      : detail.product.id,
            name    : detail.product.name,
            vendorId: detail.product.stock.vendor.id,
            sku     : detail.product.sku,
            stock   : {
              id         : detail.product.stock.id,
              total_stock: detail.product.stock.total_stock,
              sell_price : detail.product.stock.sell_price,
              buy_price  : detail.product.stock.buy_price
            }
          },
          sub_total: detail.sub_total

        }
      } ),
      status    : transaction.status,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at
    }
  } )
}

export class TransactionProcessor {
  /*
    1 use_deposit = true -> customer bayar dengan deposit
    2 use_deposit = true && total_deposit >= actual_price -> customer bayar dengan deposit dan deposit cukup untuk membayar
    3 use_deposit = true && amount_paid + total_deposit >= actual_price -> customer bayar dengan deposit dan uang tunai
    4 use_deposit = true && amount_paid + total_deposit <= actual_price -> customer bayar dengan deposit dan uang tunai namun dana tidak cukup
    5 use_deposit = true && !amount_paid && total_deposit <= actual_price -> customer bayar dengan deposit namun dana tidak cukup
    6 use_deposit = false -> customer bayar dengan cash
    7 use_deposit = false && amount_paid >= actual_price -> customer bayar dengan cash dan ada kembalian
    8 use_deposit = false && amount_paid <= actual_price -> customer bayar dengan cash namun dana tidak cukup
  */

  public payload: TransactionRequestParameter
  public customer: Customer
  public transaction_details: TransactionDetail[] = []
  public expected_total_price: number
  public queryRunner = db.queryRunner()
  public total_deposit: number = 0
  private change: number
  public transaction: Transaction
  public transaction_status: E_TransactionStatus

  constructor (
    payload: TransactionRequestParameter,
    customer: Customer,
    transactionDetails: TransactionDetail[],
    expected_total_price: number,
    total_deposit: number
  ) {
    this.payload = payload
    this.customer = customer
    this.transaction_details = transactionDetails
    this.expected_total_price = expected_total_price
    this.total_deposit = total_deposit
  }

  public async start () {
    try {
      if ( this.payload.use_deposit ) {
        if ( !this.total_deposit ) throw E_ERROR.CUSTOMER_NO_DEPOSIT
        await this.payWithDeposit()
        await this.processTransaction()
      } else {
        await this.payWithCash()
        await this.processTransaction()
      }
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  payWithCash = async () => {
    try {
      // process transaction
      await this.processTransaction()
      const hasChange = this.payload.amount_paid >= this.payload.actual_total_price
      this.change = hasChange ? this.payload.amount_paid - this.payload.actual_total_price : 0
      // [7] customer bayar dengan cash dan ada kembalian dan kembalian dijadikan deposit
      if ( hasChange && this.payload.deposit ) return await this.makeDeposit( this.change )
      // [8] customer bayar dengan cash namun dana tidak cukup
      if ( this.payload.amount_paid <= this.payload.actual_total_price ) {
        return await this.makeDebt(
          this.payload.actual_total_price - this.payload.amount_paid
        )
      }
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  payWithDeposit = async ( ) => {
    try {
      if ( this.payload.amount_paid ) {
        await this.payWithDepositAndCash()
      }
    
      // [2] customer bayar dengan deposit dan deposit cukup untuk membayar
      if ( this.total_deposit >= this.payload.actual_total_price ) {
        await this.subDeposit( this.payload.actual_total_price )
      }
    
      // [5] customer bayar dengan deposit namun dana tidak cukup dan sisa bayar jadi hutang
      if ( this.total_deposit <= this.payload.actual_total_price ) {
        await this.subDeposit( this.total_deposit )
        await this.makeDebt(
          this.payload.actual_total_price - this.total_deposit
        )
      }
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  payWithDepositAndCash = async ( ) => {
    try {
      // [3] check apakah deposit cukup untuk membayar jika iya, check apakah ada kembalian,
      // jika ya check apakah customer ingin menjadikan deposit atau kembalian
      if ( this.payload.amount_paid + this.total_deposit >= this.payload.actual_total_price ) {
        return this.payload.deposit ? await this.makeDeposit( this.payload.deposit ) : await this.processTransaction()
      }
      // [4] amount_paid + total_deposit < actual_price ==> customer bayar dengan deposit dan uang tunai namun dana tidak cukup
      if ( this.payload.amount_paid + this.total_deposit <= this.payload.actual_total_price ) {
        const debtAmt = this.payload.actual_total_price - ( this.payload.amount_paid + this.total_deposit )
        await this.makeDebt( debtAmt )
        await this.subDeposit( this.total_deposit )
        return
      }
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  processTransaction = async ( ) => {
    try {
      const transaction = new Transaction()
      transaction.customer = this.customer
      transaction.transactionDetails = this.transaction_details
      transaction.expected_total_price = this.expected_total_price
      transaction.actual_total_price = this.payload.actual_total_price
      transaction.transaction_date = this.payload.transaction_date
      transaction.amount_paid = this.payload.amount_paid
      transaction.status = E_TransactionStatus.FINISHED
      transaction.change = this.change || 0
      this.transaction = transaction
      await this.queryRunner.manager.save( transaction )
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  makeDebt = async ( amount: number ) => {
    try {
      const customerMonet = new CustomerMonetary()
      customerMonet.customer = this.customer
      customerMonet.amount = amount
      customerMonet.type = E_Recievables.DEBT
      customerMonet.transaction_id = this.transaction.id
      customerMonet.source = E_CODE_KEY.DEBT_ADD_INSUFFICIENT_FUND
      await this.queryRunner.manager.save( customerMonet )
      this.transaction_status = E_TransactionStatus.PENDING
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  makeDeposit = async ( amount: number ) => {
    try {
      const customerMonet = new CustomerMonetary()
      customerMonet.customer = this.customer
      customerMonet.amount = amount
      customerMonet.type = E_Recievables.DEPOSIT
      customerMonet.transaction_id = this.transaction.id
      customerMonet.source = E_CODE_KEY.DEP_ADD_TRANSACTION_CHANGE
      await this.queryRunner.manager.save( customerMonet )
      this.transaction_status = E_TransactionStatus.FINISHED
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  subDeposit = async ( amount: number ) => {
    try {
      const customerMonet = new CustomerMonetary()
      customerMonet.customer = this.customer
      customerMonet.amount = amount
      customerMonet.type = E_Recievables.DEPOSIT
      customerMonet.transaction_id = this.transaction.id
      customerMonet.source = E_CODE_KEY.DEP_SUB_PAID_WITH_DEPOSIT
      await this.queryRunner.manager.save( customerMonet )
      this.transaction_status = E_TransactionStatus.FINISHED
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }
}
