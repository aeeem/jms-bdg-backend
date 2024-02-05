import { Transaction } from '@entity/transaction'

export interface DeleteTransactionItemRequestParameter {
  transaction_id: number
  stock_id: number
}

export interface TransactionDetailRequestParameter{
  amount: number
  stock_id: number
  sub_total: number
  box?: boolean
}

export interface TransactionRequestParameter {
  expected_total_price: number
  actual_total_price: number
  customer_id?: number | null
  amount_paid: number
  deposit?: number
  transaction_date?: Date
  use_deposit?: boolean
  optional_discount?: number
  description?: string
  detail: TransactionDetailRequestParameter[]
  packaging_cost?: number
  is_transfer?: boolean
  pay_debt?: boolean
  sub_total: number
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
    box?: boolean
  }>
}

export interface Transactionss {
  transaction: Transaction
}
