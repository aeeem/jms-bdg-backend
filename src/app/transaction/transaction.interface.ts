import { Transaction } from '@entity/transaction'

export interface TransactionRequestParameter {
  expected_total_price: number
  actual_total_price: number
  customer_id: number
  amount_paid: number
  deposit?: number
  detail: Array<{
    amount: number
    productId: number
    sub_total: number
  }>
}

export interface Transactionss {
  transaction: Transaction
}
