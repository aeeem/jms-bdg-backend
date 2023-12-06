import { Stock } from '@entity/stock'
import { StockOpnameParameter } from './opname.interface'
import { User } from '@entity/user'
import { Opname } from '@entity/opname'

export const getAllOpnameService = async () => {
  const opnames = await Opname.find( { relations: ['operator'] } )
  return opnames
}

export const opnameStockService = async ( body: StockOpnameParameter[], user_id: number ) => {
  const items = await Promise.all( body.map( async item => {
    const _stock = await Stock.findOne( { where: { id: item.stock_id } } )
    if ( _stock ) {
      const stats = {
        stock          : _stock,
        scanned_amount : item.amount,
        previous_amount: _stock.stock_gudang,
        difference     : item.amount - _stock.stock_gudang
      }

      _stock.stock_gudang = item.amount
      await _stock.save()
      return stats
    }
    return await Promise.reject( new Error( `Stock with id ${item.stock_id} not found!` ) )
  } ) )
  const _operator = await User.findOneOrFail( user_id )
  const _opname = new Opname()
  _opname.items = items
  _opname.operator = _operator
  await _opname.save()
  return items
}
