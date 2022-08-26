export type CustomerRequestParameter = {
  name: string;
  contact_number: string;
  hutang?: number;
  piutang?: number;
}

export type CustomerUpdateRequestParameter = {
  name?: string;
  contact_number?: string;
  hutang?: number;
  piutang?: number;
}