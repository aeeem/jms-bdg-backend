import { CashFlow } from '@entity/cashFlow'
import { Transaction } from '@entity/transaction'
import dayjs from 'dayjs'
import { DateFormat } from 'src/constants/date'
import { E_CashFlowType } from 'src/database/enum/cashFlow'
import { ReportResponse } from './report.interface'

export const sumOf = ( transactions: Transaction[] ) => {
  return transactions.reduce( ( prevValue, transaction ) => {
    return prevValue + transaction.amount_paid
  }, 0 )
}

export const reportFormatter = ( cashFlows: CashFlow[], transactions: Transaction[] ) => {
  const formattedCashFlow: ReportResponse[] = cashFlows.map( cashFlow => ( {
    id      : cashFlow.id,
    date    : dayjs( cashFlow.created_at ).format( DateFormat ),
    no_nota : '-',
    notes   : cashFlow.note ?? null,
    cash_in : cashFlow.type === E_CashFlowType.CashIn ? cashFlow.amount : 0,
    cash_out: cashFlow.type === E_CashFlowType.CashOut ? cashFlow.amount : 0
  } ) )

  const formattedTransaction: ReportResponse[] = transactions.map( transaction => ( {
    id      : transaction.transaction_id,
    date    : transaction?.transaction_date ? dayjs( transaction.transaction_date ).format( DateFormat ) : '-',
    no_nota : transaction.transaction_id,
    notes   : transaction.customer?.name ?? null,
    cash_in : transaction.actual_total_price,
    cash_out: 0
  } ) )

  return [...formattedCashFlow, ...formattedTransaction]
}
