import { User } from '@entity/user'
import dayjs from 'dayjs'
import { padLeft } from 'src/helper/number'
import {
  EntitySubscriberInterface, EventSubscriber, InsertEvent, TransactionCommitEvent
} from 'typeorm'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
     * Indicates that this subscriber only listen to StockGudang events.
     */
  listenTo () {
    return User
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
  async beforeInsert ( event: InsertEvent<User> ) {
    const currentYear = dayjs().format( 'YYYY' )
    const subFirstYear = currentYear.substring( 0, 1 )
    const subLastYear = currentYear.substring( 2 )
    const users: User[] = await event.manager.query( 'select * from "user" u where extract(month from u.created_at) = extract(month from NOW()) and extract(year from u.created_at) = extract(year from now())' )
    const padded = padLeft( users.length + 1, 4 )
    const noInduk = `${subFirstYear}${padded}${subLastYear}`
    event.entity.noInduk = noInduk
  }
}
