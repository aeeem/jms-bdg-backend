import { Stock } from '@entity/stock'
import { StockToko } from '@entity/stockToko'
import { E_TOKO_CODE_KEY } from 'src/interface/StocksCode'
import {
  EntitySubscriberInterface, EventSubscriber, InsertEvent
} from 'typeorm'

@EventSubscriber()
export class StockTokoSubscriber implements EntitySubscriberInterface<StockToko> {
  /**
     * Indicates that this subscriber only listen to StockGudang events.
     */
  listenTo () {
    return StockToko
  }

  /**
     * Called before post insertion.
     */
  afterInsert ( event: InsertEvent<StockToko> ) {
    Stock.findOne( event.entity.stock_id ).then( async stock => {
      if ( stock &&
        ( event.entity.code === E_TOKO_CODE_KEY.TOK_ADD_BRG_MASUK ||
        event.entity.code === E_TOKO_CODE_KEY.TOK_SUB_BRG_RETUR ||
        event.entity.code === E_TOKO_CODE_KEY.TOK_ADD_MIX
        ) ) {
        stock.stock_toko = Number( stock.stock_toko ) + Number( event.entity.amount )
        await stock.save()
      }
  
      if ( stock && (
        event.entity.code === E_TOKO_CODE_KEY.TOK_SUB_TRANSAKSI ||
        event.entity.code === E_TOKO_CODE_KEY.TOK_SUB_MIX
      ) ) {
        stock.stock_toko = Number( stock.stock_toko ) - Number( event.entity.amount )
        await stock.save()
      }
    } )
      .catch( error => {
        return error
      } )
  }
}
