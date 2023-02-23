import { CashFlow } from '@entity/cashFlow'

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
