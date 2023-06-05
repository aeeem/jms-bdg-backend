import { CashFlow } from '@entity/cashFlow'
import { E_CashFlowCode, E_CashFlowType } from 'src/database/enum/cashFlow'
import { CreateCashRequestBody } from './cashflow.interfaces'
import { Errors } from 'src/errorHandler'

export const getCashFlowService = async ( year: number, month?: number, week?: number ) => {
  // Monthly
  if ( month && !week ) {
    return await CashFlow
      .createQueryBuilder()
      .leftJoinAndSelect( 'CashFlow.transaction', 'transaction' )
      .where( 'extract(month from CashFlow.created_at)= :month', { month } )
      .andWhere( 'extract(year from CashFlow.created_at)= :year', { year } )
      .getMany()
  }

  // Weekly
  if ( !month && week ) {
    return await CashFlow
      .createQueryBuilder()
      .leftJoinAndSelect( 'CashFlow.transaction', 'transaction' )
      .where( 'extract(week from CashFlow.created_at)=:week', { week } )
      .andWhere( 'extract(year from CashFlow.created_at)=:year', { year } )
      .getMany()
  }
}

export const createCashOutService = async ( payload: CreateCashRequestBody ) => {
  try {
    const cashFlow = new CashFlow()
    cashFlow.amount = payload.amount
    cashFlow.code = E_CashFlowCode.OUT_MISC
    cashFlow.type = E_CashFlowType.CashOut
    cashFlow.cash_type = payload.cash_type
    cashFlow.note = payload.note
    if ( payload.transaction_date ) {
      cashFlow.created_at = payload.transaction_date
    }
  
    await cashFlow.save()

    return cashFlow
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const createCashInService = async ( payload: CreateCashRequestBody ) => {
  try {
    const cashFlow = new CashFlow()
    cashFlow.amount = payload.amount
    cashFlow.code = E_CashFlowCode.IN_ADJUSTMENT
    cashFlow.type = E_CashFlowType.CashIn
    cashFlow.note = payload.note
    cashFlow.cash_type = payload.cash_type
    if ( payload.transaction_date ) {
      cashFlow.created_at = payload.transaction_date
    }

    await cashFlow.save()

    return cashFlow
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}
