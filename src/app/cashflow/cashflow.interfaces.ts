
export interface CreateCashInRequestBody {
  note: string
  amount: number
}

export interface CreateCashOutRequestBody {
  note: string
  amount: number
  cash_type: 'TRANSFER' | 'CASH'
}
