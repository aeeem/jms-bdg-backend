import { Customer } from '@entity/customer'
import { CustomerMonetary } from '@entity/customerMonetary'
import { Stock } from '@entity/stock'
import { StockToko } from '@entity/stockToko'
import { Transaction } from '@entity/transaction'
import { TransactionDetail } from '@entity/transactionDetail'
import { User } from '@entity/user'
import { db } from 'src/app'
import { E_ERROR } from 'src/constants/errorTypes'
import { E_Recievables } from 'src/database/enum/hutangPiutang'
import { E_TransactionStatus } from 'src/database/enum/transaction'
import { E_CODE_KEY } from 'src/interface/AccountCode'
import { E_GUDANG_CODE_KEY, E_TOKO_CODE_KEY } from 'src/interface/StocksCode'
import { TransactionRequestParameter } from './transaction.interface'
import { getCustomerDebtService } from '../customer/customer.service'
import { QueryRunner } from 'typeorm'
import { StockGudang } from '@entity/stockGudang'

export const restoreStocks = async ( items: TransactionDetail[] ) => {
  const queryRunner = db.queryRunner()

  try {
    await queryRunner.startTransaction()

    const restoredStock: any = []

    const stocks = await Promise.all(
      items.map( async item => {
        const stock = await Stock.findOneOrFail( item.stock_id )
        if ( item.is_box ) {
          stock.stock_gudang = Number( stock.stock_gudang ) + Number( item.amount )
          const stockGudang = new StockGudang()
          stockGudang.amount = Number( item.amount )
          stockGudang.code = E_GUDANG_CODE_KEY.GUD_ADD_BRG_PENDING_TRANSAKSI
          stockGudang.stock_id = item.stock_id
          restoredStock.push( stockGudang )
        } else {
          stock.stock_toko = Number( stock.stock_toko ) + Number( item.amount )
          const stockToko = new StockToko()
          stockToko.amount = Number( item.amount )
          stockToko.code = E_TOKO_CODE_KEY.TOK_ADD_BRG_PENDING_TRANSAKSI
          stockToko.stock_id = item.stock_id
          restoredStock.push( stockToko )
        }
        await queryRunner.manager.softRemove( item )
        return stock
      } )
    )
    await queryRunner.manager.save( stocks )
    await queryRunner.manager.save( restoredStock )

    await Promise.all(
      stocks.map( async stock => {
        await queryRunner.manager.save( stock )
        return stock
      } )
    )

    await queryRunner.commitTransaction()
  } catch ( error ) {
    await Promise.reject( error )
    await queryRunner.rollbackTransaction()
  } finally {
    await queryRunner.release()
  }
}

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
      deposit             : transaction.deposit,
      customer            : {
        id            : transaction.customer?.id,
        name          : transaction.customer?.name,
        contact_number: transaction.customer?.contact_number
      },
      packaging_cost   : transaction.packaging_cost,
      description      : transaction.description,
      optional_discount: transaction.optional_discount,
      cashier          : {
        id     : transaction.cashier?.id,
        name   : transaction.cashier?.name,
        noInduk: transaction.cashier?.noInduk
      },
      items: transaction.transactionDetails.map( detail => {
        return {
          id     : detail.id,
          amount : detail.amount,
          product: {
            id          : detail.stock?.product?.id || null,
            stockId     : detail.stock?.id,
            name        : detail.stock?.product?.name || '',
            vendorId    : detail.stock?.product?.vendorId || null,
            vendorName  : detail.stock?.product?.vendor.name ?? '',
            sku         : detail.stock?.product?.sku || '',
            stock_toko  : detail.stock?.stock_toko,
            stock_gudang: detail.stock?.stock_gudang,
            sell_price  : detail.stock?.sell_price,
            buy_price   : detail.stock?.buy_price,
            box         : detail?.is_box,
            weight      : detail?.stock?.weight
          },
          sub_total: detail.sub_total
        }
      } ),
      status           : transaction.status,
      is_transfer      : transaction.is_transfer,
      created_at       : transaction.created_at,
      updated_at       : transaction.updated_at,
      transaction_id   : transaction.transaction_id,
      remaining_deposit: transaction.remaining_deposit,
      usage_deposit    : transaction.usage_deposit,
      pay_debt_amount  : transaction.pay_debt_amount,
      sub_total        : transaction.sub_total
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
    9 use_despoit = false && !amount_paid -> customer tidak bayar
  */

  public payload: TransactionRequestParameter
  public customer: Customer | undefined
  public transaction_details: TransactionDetail[] = []
  public expected_total_price: number
  public queryRunner: QueryRunner
  public total_deposit: number = 0
  private change: number
  public transaction: Transaction
  public transaction_status: E_TransactionStatus
  public isPending: boolean
  public user?: User
  private remainingDeposit: number
  public pay_debt: boolean
  private pay_debt_amount: number
  public calculated_price: number

  constructor (
    payload: TransactionRequestParameter,
    customer: Customer | undefined,
    transactionDetails: TransactionDetail[],
    expected_total_price: number,
    total_deposit: number,
    isPending: boolean,
    pay_debt: boolean = false,
    queryRunner: QueryRunner,
    user?: User
  ) {
    this.payload = payload
    this.customer = customer
    this.transaction_details = transactionDetails
    this.expected_total_price = expected_total_price
    this.total_deposit = total_deposit
    this.transaction = new Transaction()
    this.isPending = isPending
    this.user = user
    this.pay_debt = pay_debt
    this.calculateTotalPrice()
    this.queryRunner = queryRunner
  }

  calculateTotalPrice = () => {
    let totalPrice = this.payload.actual_total_price

    // check if there is discount
    if ( this.payload.optional_discount ) {
      totalPrice -= this.payload.optional_discount
    }
    // check if there is packaging cost added
    if ( this.payload.packaging_cost ) {
      totalPrice += this.payload.packaging_cost
    }

    this.calculated_price = totalPrice
  }

  public async start (): Promise<void> {
    try {
      if ( this.payload.use_deposit && this.customer && !this.isPending ) {
        if ( !this.total_deposit ) throw E_ERROR.CUSTOMER_NO_DEPOSIT
        await this.payWithDeposit()
      } else if ( !this.isPending ) {
        await this.payWithCash()
      }
      return await this.processTransaction()
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  payWithCash = async (): Promise<void> => {
    try {
      // process transaction
      const hasChange = this.payload.amount_paid > this.calculated_price
      const change = hasChange
        ? this.payload.amount_paid - this.calculated_price
        : 0
      this.change = change

      // [7] customer bayar dengan cash dan ada kembalian dan kembalian dijadikan deposit
      if ( hasChange && this.payload.deposit ) {
        console.log(
          ' customer bayar dengan cash dan ada kembalian dan kembalian dijadikan deposit'
        )
        return await this.makeDeposit( change )
      }
      // [9] customer bayar hutang dengan kembalian tanpa menjadikan deposit

      if ( hasChange && this.pay_debt ) {
        console.log(
          'customer bayar hutang dengan kembalian tanpa menjadikan deposit'
        )

        return await this.subDebt()
      }
      // [8] customer bayar dengan cash namun dana tidak cukup
      if ( this.payload.amount_paid < this.calculated_price ) {
        console.log( 'customer bayar dengan cash namun dana tidak cukup' )
        console.log( this.payload.amount_paid, this.calculated_price, 'Data Calc price-amount_paid' )
        return await this.makeDebt(
          this.calculated_price - this.payload.amount_paid
        )
      }
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  payWithDeposit = async (): Promise<void> => {
    try {
      console.log( 'pay with deposit' )
      if ( this.payload.amount_paid ) {
        return await this.payWithDepositAndCash()
      }

      // [2] customer bayar dengan deposit dan deposit cukup untuk membayar
      if ( this.total_deposit >= this.calculated_price ) {
        return await this.subDeposit( this.calculated_price )
      }

      // [5] customer bayar dengan deposit namun dana tidak cukup dan sisa bayar jadi hutang
      if ( this.total_deposit <= this.calculated_price ) {
        await this.subDeposit( this.total_deposit )
        return await this.makeDebt( this.calculated_price - this.total_deposit )
      }
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  payWithDepositAndCash = async (): Promise<void> => {
    try {
      console.log( 'pay with deposit AND CASh' )

      const currentPaid =
        Number( this.payload.amount_paid ) + Number( this.total_deposit )
      console.log( currentPaid )

      // [3] check apakah deposit cukup untuk membayar jika iya, check apakah ada kembalian,
      // jika ya check apakah customer ingin menjadikan deposit atau kembalian
      if ( currentPaid > this.calculated_price && this.payload.deposit ) {
        await this.subDeposit( this.total_deposit )
        return await this.makeDeposit( this.payload.deposit )
      }
      // [4] amount_paid + total_deposit < actual_price ==> customer bayar dengan deposit dan uang tunai namun dana tidak cukup
      if ( currentPaid < this.calculated_price ) {
        const debtAmt = this.calculated_price - currentPaid
        await this.makeDebt( debtAmt )
        return await this.subDeposit( this.total_deposit )
      }

      if ( currentPaid > this.calculated_price && !this.payload.deposit ) {
        this.change = currentPaid - this.calculated_price
        console.log( this.change )
      }

      return await this.subDeposit( this.total_deposit )
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  public processTransaction = async (): Promise<void> => {
    try {
      this.transaction.customer = this.customer
      this.transaction.transactionDetails = this.transaction_details
      this.transaction.expected_total_price = this.expected_total_price
      this.transaction.actual_total_price = this.calculated_price
      this.transaction.transaction_date = this.payload.transaction_date
      this.transaction.amount_paid = this.payload.amount_paid
      this.transaction.status = this.isPending
        ? E_TransactionStatus.PENDING
        : E_TransactionStatus.FINISHED
      this.transaction.change = this.change || 0
      this.transaction.description = this.payload.description
      this.transaction.optional_discount = this.payload.optional_discount
      this.transaction.packaging_cost = this.payload.packaging_cost ?? 0
      this.transaction.cashier = this.user
      this.transaction.deposit = this.payload.deposit
      this.transaction.is_transfer = this.payload.is_transfer
      this.transaction.sub_total = await this.calcSubtotal()
      if ( this.payload.amount_paid < this.calculated_price ) {
        this.transaction.outstanding_amount =
          this.calculated_price - this.payload.amount_paid
      }
      if ( this.payload.use_deposit ) {
        this.transaction.usage_deposit =
          this.total_deposit <= this.transaction.actual_total_price
            ? this.total_deposit
            : this.transaction.actual_total_price
        this.transaction.remaining_deposit =
          Number( this.payload.deposit ) + Number( this.remainingDeposit )
        // TODO temporary, needed proper code
        const is_debt =
          this.payload.amount_paid + this.total_deposit < this.calculated_price
        this.transaction.outstanding_amount = is_debt
          ? this.calculated_price -
            ( this.payload.amount_paid + this.total_deposit )
          : 0
      }
      if ( this.pay_debt ) {
        this.transaction.pay_debt_amount = this.pay_debt_amount
      }

      await this.queryRunner.manager.save( this.transaction )
      return
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  calcSubtotal = async () => {
    const stock_details = await Promise.all(
      this.payload.detail.map( async item => {
        const stock = await Stock.findOneOrFail( item.stock_id )
        if ( item.box ) {
          return stock.weight * item.amount * item.sub_total
        } else {
          return item.sub_total * item.amount
        }
      } )
    )

    const sum = stock_details.reduce( ( prev, current ) => prev + current, 0 )

    return sum
  }

  makeDebt = async ( amount: number ): Promise<void> => {
    try {
      if ( !this.customer ) { throw E_ERROR.CANT_MAKE_DEBT_FOR_UNREGISTERED_CUSTOMER }
      const customerMonet = new CustomerMonetary()
      customerMonet.customer = this.customer
      // customerMonet.amount = this.payload.optional_discount
      //   ? amount - this.payload.optional_discount
      //   : amount // already calculated with total amount at line 175 func calculate total_price so amount just be amount
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

  makeDeposit = async ( amount: number ): Promise<void> => {
    try {
      const customerMonet = new CustomerMonetary()
      let remainingMoney = 0
      if ( this.pay_debt ) {
        if ( !this.customer ) { throw E_ERROR.CANT_PAY_DEBT_FOR_UNREGISERED_CUSTOMER }
        const { total_debt } = await getCustomerDebtService( this.customer.id )
        // tidak bisa melakukan bayar hutang + deposit jika dia masih memiliki hutang setelah bayar dengan kembalian
        if ( total_debt - this.change > 0 ) { throw E_ERROR.CHANGE_INSUFFICIENT_TO_PAY_DEBT_AND_MAKE_DEPOSIT }
        const payDebtMonet = new CustomerMonetary()
        remainingMoney = this.change - total_debt
        payDebtMonet.customer = this.customer
        payDebtMonet.amount = remainingMoney
        payDebtMonet.type = E_Recievables.DEBT
        payDebtMonet.transaction_id = this.transaction.id
        payDebtMonet.source = E_CODE_KEY.DEBT_SUB_PAY_WITH_CHANGE
        await this.queryRunner.manager.save( payDebtMonet )
      }
      customerMonet.customer = this.customer
      customerMonet.amount = this.pay_debt
        ? remainingMoney
        : Number( this.payload.deposit ?? 0 )
      customerMonet.type = E_Recievables.DEPOSIT
      customerMonet.transaction_id = this.transaction.id
      customerMonet.source = E_CODE_KEY.DEP_ADD_TRANSACTION_CHANGE
      this.transaction_status = E_TransactionStatus.FINISHED
      await this.queryRunner.manager.save( customerMonet )
      this.change = amount - Number( this.payload.deposit ?? 0 )
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  subDebt = async (): Promise<void> => {
    try {
      if ( this.change < 1 ) { throw E_ERROR.CHANGE_INSUFFICIENT_TO_PAY_DEBT_AND_MAKE_DEPOSIT }
      if ( this.customer ) {
        const customerMonet = new CustomerMonetary()
        const { total_debt } = await getCustomerDebtService( this.customer.id )
        const pay_debt =
          total_debt - this.change < 0 ? total_debt : this.change
        console.log( 'pay_debt', pay_debt )
        console.log( 'total_debt', total_debt )
        customerMonet.customer = this.customer
        customerMonet.amount = pay_debt
        customerMonet.type = E_Recievables.DEBT
        customerMonet.transaction_id = this.transaction.id
        customerMonet.source = E_CODE_KEY.DEBT_SUB_PAY_WITH_CASH
        await this.queryRunner.manager.save( customerMonet )
        this.transaction_status = E_TransactionStatus.FINISHED
        this.pay_debt_amount = pay_debt
        this.change = this.change - pay_debt
      }
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }

  subDeposit = async ( amount: number ): Promise<void> => {
    try {
      const customerMonet = new CustomerMonetary()
      customerMonet.customer = this.customer
      customerMonet.amount = amount
      customerMonet.type = E_Recievables.DEPOSIT
      customerMonet.transaction_id = this.transaction.id
      customerMonet.source = E_CODE_KEY.DEP_SUB_PAID_WITH_DEPOSIT
      await this.queryRunner.manager.save( customerMonet )
      this.transaction_status = E_TransactionStatus.FINISHED
      this.remainingDeposit = this.total_deposit - amount
    } catch ( error ) {
      return await Promise.reject( error )
    }
  }
}
