import { CustomerMonetary } from '@entity/customerMonetary'
import { E_CODE_KEY } from 'src/interface/AccountCode'

const isAddition = ( source: E_CODE_KEY ) => {
  return source.includes( '_ADD_' )
}

export const CalculateTotalBalance = ( monet: CustomerMonetary[] ): number => {
  const total = monet.reduce( ( acc, cur ) => {
    if ( isAddition( cur.source ) ) return acc + cur.amount
    return acc - cur.amount
  }, 0 )
  return total
}
