import { CashFlow } from '@entity/cashFlow'
import { E_CashFlowCode, E_CashFlowType } from 'src/database/enum/cashFlow'
import { CreateCashInRequestBody, CreateCashOutRequestBody } from './cashflow.interfaces'

export const getCashFlowService = async ( year: number, month?: number, week?: number ) => {
  // Monthly
  if ( month && !week ) {
    return await CashFlow
      .createQueryBuilder()
      .leftJoinAndSelect( 'CashFlow.transaction', 'transaction' )
      .where( `extract(month from CashFlow.created_at)=${month}` )
      .andWhere( `extract(year from CashFlow.created_at)=${year}` )
      .getMany()
  }

  // Weekly
  if ( !month && week ) {
    return await CashFlow
      .createQueryBuilder()
      .leftJoinAndSelect( 'CashFlow.transaction', 'transaction' )
      .where( `extract(week from CashFlow.created_at)=${week}` )
      .andWhere( `extract(year from CashFlow.created_at)=${year}` )
      .getMany()
  }
}

export const createCashOutService = async ( payload: CreateCashOutRequestBody ) => {
  const cashFlow = new CashFlow()
  cashFlow.amount = payload.amount
  cashFlow.code = E_CashFlowCode.OUT_MISC
  cashFlow.type = E_CashFlowType.CashOut
  cashFlow.cash_type = payload.cash_type
  cashFlow.note = payload.note
  
  await cashFlow.save()
  return cashFlow
}

export const createCashInService = async ( payload: CreateCashInRequestBody ) => {
  const cashFlow = new CashFlow()
  cashFlow.amount = payload.amount
  cashFlow.code = E_CashFlowCode.IN_ADJUSTMENT
  cashFlow.type = E_CashFlowType.CashIn
  cashFlow.note = payload.note
  await cashFlow.save()
  return cashFlow
}
