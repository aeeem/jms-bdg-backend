import { Stock } from '@entity/stock'
import { StockGudang } from '@entity/stockGudang'
import { E_GUDANG_CODE_KEY } from 'src/interface/StocksCode'
import {
  EntitySubscriberInterface, EventSubscriber, InsertEvent
} from 'typeorm'

@EventSubscriber()
export class StockGudangSubscriber implements EntitySubscriberInterface<StockGudang> {
  /**
     * Indicates that this subscriber only listen to StockGudang events.
     */
  listenTo () {
    return StockGudang
  }

  /**
     * Called before post insertion.
     */
  async afterinsert ( event: InsertEvent<StockGudang> ) {
    const stock = await Stock.findOne( event.entity.stock_id )
    
    if ( stock && (
      event.entity.code === E_GUDANG_CODE_KEY.GUD_ADD_BRG_MASUK ||
      event.entity.code === E_GUDANG_CODE_KEY.GUD_ADD_BRG_RETUR
    ) ) {
      stock.stock_gudang = stock.stock_gudang + event.entity.amount
      await stock.save()
    }

    if ( stock && (
      event.entity.code === E_GUDANG_CODE_KEY.GUD_SUB_BRG_HAPUS ||
      event.entity.code === E_GUDANG_CODE_KEY.GUD_SUB_BRG_KELUAR ||
      event.entity.code === E_GUDANG_CODE_KEY.GUD_SUB_BRG_PIN_TOKO

    ) ) {
      stock.stock_gudang = stock.stock_gudang - event.entity.amount
      await stock.save()
    }
  }
}
