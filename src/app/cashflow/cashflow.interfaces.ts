
export interface CreateCashRequestBody {
  note: string
  amount: number
  cash_type: 'transfer' | 'cash'
  transaction_date?: Date
}
