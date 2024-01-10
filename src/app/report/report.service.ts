/* eslint-disable @typescript-eslint/no-unused-vars */
import { CashFlow } from '@entity/cashFlow'
import { Transaction } from '@entity/transaction'
import { Vendor } from '@entity/vendor'
import dayjs, { Dayjs } from 'dayjs'
import { DateFormat } from 'src/constants/date'
import { E_CashFlowType, E_CashType } from 'src/database/enum/cashFlow'
import { Raw } from 'typeorm'
import { reportFormatter, sumOf } from './report.helper'
import { CashFlowResponseItem, DailyReportResponse } from './report.interface'

export const getDailyReportService = async ( date: Dayjs, typeCash: string = E_CashFlowType.CashIn ): Promise<any> => {
  const flowType = typeCash === E_CashFlowType.CashIn ? typeCash : E_CashFlowType.CashOut
  const cashFlow = await CashFlow.find( {
    relations: [
      'transaction',
      'transaction.customer',
      'customer'
    ],
    where: { created_at: Raw( alias => `${alias} >= current_date - 1` ), type: flowType },
    order: { created_at: 'DESC' }
  } )

  const rawTodayCashFlow = cashFlow.filter( cf => dayjs( cf?.created_at ).format( DateFormat ) === date.format( DateFormat ) )
  const rawYesterdayCashFlow = cashFlow.filter( cf => dayjs( cf?.created_at ).format( DateFormat ) === date.subtract( 1, 'day' ).format( DateFormat ) )

  const todayCashFlow: CashFlowResponseItem[] = rawTodayCashFlow.map( cf => {
    const payDebtAmount = cf.transaction_id ? cf.transaction.pay_debt_amount : 0
    const customerName = cf.customer_id ? cf.customer.name : cf.transaction.customer?.name
    return {
      id                : cf.id,
      note              : cf.note,
      type              : cf.cash_type,
      flow_type         : cf.type, // check in out
      sub_total_cash    : cf.cash_type === E_CashType.CASH ? cf.amount + payDebtAmount : 0,
      sub_total_transfer: cf.cash_type === E_CashType.TRANSFER ? cf.amount + payDebtAmount : 0,
      customerName
    }
  } )

  const yesterdayCashflow = rawYesterdayCashFlow.length
    ? rawYesterdayCashFlow.map( cf => {
      const payDebtAmount = cf.transaction.pay_debt_amount ?? 0

      return {
        id                : cf.id,
        note              : 'Sistem Stock Tunai (Total transaksi H-1)',
        type              : `${E_CashType.CASH} / ${E_CashType.TRANSFER}`,
        sub_total_cash    : cf.cash_type === E_CashType.CASH ? cf.amount + payDebtAmount : 0,
        sub_total_transfer: cf.cash_type === E_CashType.TRANSFER ? cf.amount + payDebtAmount : 0,
        flow_type         : cf.type
      }
    } )?.reduceRight( ( acc, curr ) => {
      return {
        id                : curr.id,
        note              : curr.note,
        type              : curr.type,
        sub_total_cash    : acc.sub_total_cash + curr.sub_total_cash,
        sub_total_transfer: acc.sub_total_transfer + curr.sub_total_transfer,
        flow_type         : curr.flow_type
      }
    } )
    : {}

  return {
    todayCashFlow,
    yesterdayCashflow
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
