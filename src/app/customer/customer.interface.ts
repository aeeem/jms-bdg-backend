export interface CustomerRequestParameter {
  name: string
  contact_number: string
}

export interface CustomerUpdateRequestParameter {
  name?: string
  contact_number?: string
  hutang?: number
  piutang?: number
}

export interface AddDepositRequestParameter{
  customer_id: number
  amount: number
  is_transfer: boolean
}

export interface AddDebtRequestParameter{
  customer_id: number
  amount: number
  is_transfer: boolean
}
