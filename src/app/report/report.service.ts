import { Transaction } from '@entity/transaction'
import dayjs, { Dayjs } from 'dayjs'
import { DateFormat } from 'src/constants/date'
import { E_TransactionStatus } from 'src/database/enum/transaction'
import { sumOf } from './report.helper'

export const getDailyReportService = async ( date: Dayjs ) => {
  const transactions = await Transaction.find( { where: { status: E_TransactionStatus.FINISHED }, relations: ['customer'] } )
  const todayTransaction = transactions.filter( transaction => dayjs( transaction?.transaction_date ).format( DateFormat ) === date.format( DateFormat ) )
  const yesterdayTransaction = transactions.filter( transactions => dayjs( transactions?.transaction_date ).format( DateFormat ) === date.subtract( 1, 'day' ).format( DateFormat ) )
  return {
    sumYesterday: {
      transfer: sumOf( yesterdayTransaction.filter( transaction => transaction.is_transfer ) ),
      cash    : sumOf( yesterdayTransaction.filter( transaction => !transaction.is_transfer ) )
    },
    todayTransaction
  }
}
