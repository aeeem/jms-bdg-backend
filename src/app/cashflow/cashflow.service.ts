import { CashFlow } from '@entity/cashFlow'
import { E_CashFlowCode, E_CashFlowType } from 'src/database/enum/cashFlow'
import { CreateExpenseRequestBody } from './cashflow.interfaces'

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

export const createExpenseService = async ( payload: CreateExpenseRequestBody ) => {
  const cashFlow = new CashFlow()
  cashFlow.amount = payload.amount
  cashFlow.code = E_CashFlowCode.OUT_MISC
  cashFlow.type = E_CashFlowType.CashOut
  cashFlow.note = payload.note
  
  await cashFlow.save()
  return cashFlow
}
