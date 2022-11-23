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
  async afterinsert ( event: InsertEvent<StockToko> ) {
    const stock = await Stock.findOne( event.entity.stock_id )
    
    if ( stock &&
      ( event.entity.code === E_TOKO_CODE_KEY.TOK_ADD_BRG_MASUK ||
      event.entity.code === E_TOKO_CODE_KEY.TOK_SUB_BRG_RETUR ) ) {
      stock.stock_toko = stock.stock_toko + event.entity.amount
      await stock.save()
    }

    if ( stock && event.entity.code === E_TOKO_CODE_KEY.TOK_SUB_TRANSAKSI ) {
      stock.stock_toko = stock.stock_toko - event.entity.amount
      await stock.save()
    }
  }
}
