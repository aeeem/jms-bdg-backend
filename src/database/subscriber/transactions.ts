import { Transaction } from '@entity/transaction'
import dayjs from 'dayjs'
import { padLeft } from 'src/helper/number'
import {
  EntitySubscriberInterface, EventSubscriber, InsertEvent, TransactionCommitEvent
} from 'typeorm'
import { E_TransactionStatus } from '../enum/transaction'

@EventSubscriber()
export class TransactionsSubscriber implements EntitySubscriberInterface<Transaction> {
  /**
     * Indicates that this subscriber only listen to StockGudang events.
     */
  listenTo () {
    return Transaction
  }

  /**
     * Called after transaction commit.
     */
  afterTransactionCommit ( event: TransactionCommitEvent ) {
    // console.log( 'AFTER TRANSACTION COMMITTED: ', event )
  }

  /**
     * Called before post insertion.
     */
  async beforeInsert ( event: InsertEvent<Transaction> ) {
    const currentMonth = dayjs().format( 'YYMM' )
    const transactions: Transaction[] = await event.manager.query( 'select * from "transaction" t where extract(month from t.transaction_date) = extract(month from NOW()) and extract(year from t.transaction_date) = extract(year from now())' )
    const padded = padLeft( transactions.length + 1, 6 )
    const no_nota = `${currentMonth}${padded}`
    event.entity.transaction_id = no_nota
  }
}
