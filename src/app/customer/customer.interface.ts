export interface CustomerRequestParameter {
  name: string
  contact_number: string
  hutang?: number
  piutang?: number
}

export interface CustomerUpdateRequestParameter {
  name?: string
  contact_number?: string
  hutang?: number
  piutang?: number
}
