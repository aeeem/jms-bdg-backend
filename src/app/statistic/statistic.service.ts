import { Customer } from '@entity/customer'
import { Product } from '@entity/product'
import { E_ERROR } from 'src/constants/errorTypes'
import { Transaction } from '@entity/transaction'
import { Errors } from 'src/errorHandler'
import makeResponse from 'src/helper/response'
import { CashFlow } from '@entity/cashFlow'
import { CustomerMonetary } from '@entity/customerMonetary'
import { E_Recievables } from 'src/database/enum/hutangPiutang'
import { CalculateTotalBalance } from 'src/helper/monetaryHelper'

export const getDashboardStatsService = async () => {
  try {
    const products = await Product.find()
    const customers = await Customer.find()
    const todayTransactions = await Transaction.createQueryBuilder( 'transaction' )
      .where( 'transaction.created_at::Date=current_date' )
      .select( 'sum(transaction.actual_total_price)', 'todayTransaction' )
      .getRawOne()

    const balance = await CashFlow.createQueryBuilder( 'cashflow' )
      .where( 'cashflow.created_at::Date=current_date and cashflow.cash_type=\'cash\'' )
      .select( 'sum(case when cashflow.type = \'cash-in\' then cashflow.amount else 0 end) - sum(case when cashflow.type = \'cash-out\' then cashflow.amount else 0 end) ', 'balance' )
      .getRawOne()

    const tempStatistic = await Transaction.createQueryBuilder( 'transaction' )
      .select( 'extract(month from transaction.created_at)', 'monthNumber' )
      .addSelect( 'to_char(transaction.created_at, \'YYYY-MM\')', 'month' )
      .addSelect( 'sum(transaction.actual_total_price)', 'monthlySum' )
      .groupBy( 'extract(month from transaction.created_at), to_char(transaction.created_at, \'YYYY-MM\')' )
      .orderBy( 'month', 'ASC' )
      .where( 'extract(year from transaction.created_at) = extract(year from current_date)' )
      .getRawMany()

    const tempCustomerDeposit = await CustomerMonetary.createQueryBuilder( 'customer_monetary' )
      .where( `customer_monetary.type = '${E_Recievables.DEPOSIT}'` )
      .leftJoin( 'customer_monetary.customer', 'customer' )
      .select( 'customer_monetary.customer_id', 'customer_id' )
      .addSelect( 'customer.name', 'name' )
      .addSelect( 'customer.contact_number', 'contact_number' )
      .addSelect( 'json_agg(jsonb_build_object(\'id\', customer_monetary.id, \'amount\', amount,  \'source\', source))', 'deposit' )
      .groupBy( 'customer_monetary.customer_id, customer.name, customer.contact_number' )
      .getRawMany()

    if ( products === null ) throw E_ERROR.PRODUCT_NOT_FOUND
    if ( customers === null ) throw E_ERROR.CUSTOMER_NOT_FOUND
    if ( todayTransactions === null ) throw E_ERROR.TRANSACTION_NOT_FOUND
    if ( balance === null ) throw E_ERROR.CASHFLOW_NOT_FOUND
    if ( tempStatistic === null ) throw E_ERROR.CASHFLOW_NOT_FOUND
    if ( tempCustomerDeposit === null ) throw E_ERROR.CUSTOMER_NOT_FOUND

    const statistic = Array.from( { length: 12 }, ( _, index ) => tempStatistic.find( result => result.monthNumber === ( index + 1 ).toString() ) || null )
    const customerDeposit = tempCustomerDeposit.filter( it => {
      return CalculateTotalBalance( it.deposit ) > 0
    } )

    return makeResponse.success( {
      data: {
        products        : products.length,
        customers       : customers.length,
        todayTransaction: todayTransactions.todayTransaction ?? 0,
        balance         : balance.balance ?? 0,
        statistic,
        customerDeposit

      },
      stat_code: 200,
      stat_msg : 'DATA FOUND'
    } )
  } catch ( error: any ) {
    throw new Errors( error )
  }
}
