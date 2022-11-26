import { StockGudang } from '@entity/stockGudang'
import { StockToko } from '@entity/stockToko'

const isAddition = ( source: string ) => {
  return source.includes( '_ADD_' )
}

export const isSubtraction = ( source: string ) => {
  return source.includes( '_SUB_' )
}

export const CalculateTotalStock = ( stock: StockGudang[] | StockToko[] ): number => {
  const total = stock.reduce( ( acc, cur ) => {
    if ( isAddition( cur.code ) ) return acc + cur.amount
    return acc - cur.amount
  }, 0 )
  return total
}
