import { Transaction } from '@entity/transaction'

export interface DeleteTransactionItemRequestParameter {
  transaction_id: number
  stock_id: number
}

export interface TransactionDetailRequestParameter{
  amount: number
  stock_id: number
  sub_total: number
}

export interface TransactionRequestParameter {
  expected_total_price: number
  actual_total_price: number
  customer_id?: number
  amount_paid: number
  deposit?: number
  transaction_date?: Date
  use_deposit?: boolean
  optional_discount?: number
  description?: string
  detail: TransactionDetailRequestParameter[]
}
export interface TransactionUpdateRequestParameter {
  expected_total_price?: number
  actual_total_price?: number
  customer_id?: number
  amount_paid?: number
  deposit?: number
  transaction_date?: Date
  detail: Array<{
    id: number
    amount?: number
    productId?: number
    sub_total?: number
  }>
}

export interface Transactionss {
  transaction: Transaction
}
