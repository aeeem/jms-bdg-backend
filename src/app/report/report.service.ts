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

export const getDailyReportService = async ( date: Dayjs ): Promise<any> => {
  const cashFlow = await CashFlow.find( {
    relations: ['transaction'],
    where    : { created_at: Raw( alias => `${alias} >= current_date - 1` ) }
  } )
  const rawTodayCashFlow = cashFlow.filter( cf => dayjs( cf?.created_at ).format( DateFormat ) === date.format( DateFormat ) )
  const rawYesterdayCashFlow = cashFlow.filter( cf => dayjs( cf?.created_at ).format( DateFormat ) === date.subtract( 1, 'day' ).format( DateFormat ) )
  
  const todayCashFlow: CashFlowResponseItem[] = rawTodayCashFlow.map( cf => {
    return {
      id                : cf.id,
      note              : cf.transaction ? cf.transaction.customer?.name ?? '' : cf.note,
      type              : cf.cash_type,
      flow_type         : cf.type,
      sub_total_cash    : cf.cash_type === E_CashType.CASH ? cf.amount : 0,
      sub_total_transfer: cf.cash_type === E_CashType.TRANSFER ? cf.amount : 0
    }
  } )

  const yesterdayCashflow = rawYesterdayCashFlow.map( cf => ( {
    id                : cf.id,
    note              : 'Stock Tunai (Total transaksi H-1)',
    type              : `${E_CashType.CASH} / ${E_CashType.TRANSFER}`,
    sub_total_cash    : cf.cash_type === E_CashType.CASH ? cf.amount : 0,
    sub_total_transfer: cf.cash_type === E_CashType.TRANSFER ? cf.amount : 0,
    flow_type         : cf.type
  } ) ).reduceRight( ( acc, curr ) => {
    return {
      id                : curr.id,
      note              : curr.note,
      type              : curr.type,
      sub_total_cash    : curr.flow_type === E_CashFlowType.CashIn ? acc.sub_total_cash + curr.sub_total_cash : acc.sub_total_cash - curr.sub_total_cash,
      sub_total_transfer: curr.flow_type === E_CashFlowType.CashIn ? acc.sub_total_transfer + curr.sub_total_transfer : acc.sub_total_transfer - curr.sub_total_transfer,
      flow_type         : curr.flow_type
    }
  } )

  return {
    todayCashFlow,
    yesterdayCashflow
  }

  // return {
  //   yesterdayTransaction: yesterdayTransactionFormatted,
  //   todayTransactions   : [...cashFlowFormatted, ...todayCashFlow]
  // }
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
