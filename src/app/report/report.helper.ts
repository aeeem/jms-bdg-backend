import { Transaction } from '@entity/transaction'

export const sumOf = ( transactions: Transaction[] ) => {
  return transactions.reduce( ( prevValue, transaction ) => {
    return prevValue + transaction.amount_paid
  }, 0 )
}
