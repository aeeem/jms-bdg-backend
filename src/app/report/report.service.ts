/* eslint-disable @typescript-eslint/no-unused-vars */
import { CashFlow } from '@entity/cashFlow'
import { Transaction } from '@entity/transaction'
import { Vendor } from '@entity/vendor'
import dayjs, { Dayjs } from 'dayjs'
import { DateFormat } from 'src/constants/date'
import {
  E_CashFlowCode, E_CashFlowType, E_CashType
} from 'src/database/enum/cashFlow'
import { E_TransactionStatus } from 'src/database/enum/transaction'
import { Raw } from 'typeorm'
import { reportFormatter, sumOf } from './report.helper'
import { CashFlowResponseItem, DailyReportResponse } from './report.interface'

export const getDailyReportService = async ( date: Dayjs ): Promise<DailyReportResponse> => {
  const transactions = await Transaction.find( { where: { status: E_TransactionStatus.FINISHED }, relations: ['customer'] } )
  const cashFlow = await CashFlow.createQueryBuilder( )
    .where( 'Date(CashFlow.created_at) = current_date' )
    .orWhere( 'Date(CashFlow.created_at) = current_date - 1' )
    .getMany()
  const todayTransaction = transactions.filter( transaction => dayjs( transaction?.transaction_date ).format( DateFormat ) === date.format( DateFormat ) )
  const cashFlowFormatted: CashFlowResponseItem[] = cashFlow.map( cf => {
    return {
      id                : cf.id,
      note              : cf.note,
      type              : cf.cash_type,
      sub_total_cash    : cf.cash_type === 'cash' ? cf.amount : 0,
      flow_type         : cf.type,
      sub_total_transfer: cf.cash_type === 'transfer' ? cf.amount : 0
    }
  } )
  const transactionFormatted: CashFlowResponseItem[] = todayTransaction.map( transaction => {
    return {
      id                : transaction.id,
      note              : transaction.customer?.name ?? '',
      type              : transaction.is_transfer ? E_CashType.TRANSFER : E_CashType.TRANSFER,
      flow_type         : 'cash-in',
      sub_total_cash    : !transaction.is_transfer ? transaction.actual_total_price : 0,
      sub_total_transfer: transaction.is_transfer ? transaction.actual_total_price : 0
    }
  } )

  const yesterdayTransactionFormatted: CashFlowResponseItem = cashFlow.map( cashFlow => ( {
    id                : cashFlow.id,
    note              : 'Stock Tunai (Total transaksi H-1)',
    type              : `${E_CashType.CASH} / ${E_CashType.TRANSFER}`,
    sub_total_cash    : cashFlow.cash_type === E_CashType.CASH ? cashFlow.amount : 0,
    sub_total_transfer: cashFlow.cash_type === E_CashType.TRANSFER ? cashFlow.amount : 0
  } ) ).reduce( ( acc, curr ) => {
    const sub_total_cash = curr.type === E_CashFlowType.CashIn ? acc.sub_total_cash + curr.sub_total_cash : acc.sub_total_cash - curr.sub_total_cash
    const sub_total_transfer = curr.type === E_CashFlowType.CashIn ? acc.sub_total_transfer + curr.sub_total_transfer : acc.sub_total_transfer - curr.sub_total_transfer
    return {
      id  : curr.id,
      note: 'Stock Tunai (Total transaksi H-1)',
      type: curr.type,
      sub_total_cash,
      sub_total_transfer
    }
  } )
  
  return {
    yesterdayTransaction: yesterdayTransactionFormatted,
    todayTransactions   : [...cashFlowFormatted, ...transactionFormatted]
  }
}

export const getCashReportService = async () => {
  const transactions = await Transaction.find( { relations: ['customer'] } )
  const cashFlows = await CashFlow.find()

  return reportFormatter( cashFlows, transactions )
}

export const getVendorReportService = async ( month: number ) => {
  const vendor = await Vendor.find( {
    relations: [
      'products',
      'products.stocks',
      'products.stocks.transactionDetails'
    ]
  } )
  return vendor
}
