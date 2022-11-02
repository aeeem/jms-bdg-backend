import { Product } from '@entity/product'
import { Stock } from '@entity/stock'
import { StockGudang } from '@entity/stockGudang'
import { StockToko } from '@entity/stockToko'
import { db } from 'src/app'
import { E_ERROR } from 'src/constants/errorTypes'
import { Errors } from 'src/errorHandler'
import { E_GUDANG_CODE_KEY, E_TOKO_CODE_KEY } from 'src/interface/StocksCode'
import { PindahStockGudangRequestParameter, TambahStockGudangRequestParameter } from './gudang.interface'

export const getStockGudangService = async () => {
  try {
    const stocks = await StockGudang.find( {
      relations: [
        'stock',
        'stock.product',
        'stock.product.vendor'
      ]
    } )
    return stocks
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const getStockTokoService = async () => {
  try {
    const stocks = await StockToko.find( {
      relations: [
        'stock',
        'stock.product',
        'stock.product.vendor'
      ]
    } )
    return stocks
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const pindahStockGudangService = async ( payload: PindahStockGudangRequestParameter ) => {
  const queryRunner = db.queryRunner()
  try {
    await queryRunner.startTransaction()
    const stocks_gudang = payload.stock_ids.map( stock_id => {
      const item_gudang = new StockGudang()
      item_gudang.amount = 1
      item_gudang.code = E_GUDANG_CODE_KEY.GUD_SUB_BRG_PIN_TOKO
      item_gudang.stock_id = stock_id
      return item_gudang
    } )

    const stocks_toko = payload.stock_ids.map( stock_id => {
      const item_toko = new StockToko()
      item_toko.amount = 1
      item_toko.code = E_TOKO_CODE_KEY.TOK_ADD_BRG_MASUK
      item_toko.stock_id = stock_id
      return item_toko
    } )
    
    await queryRunner.manager.save( stocks_gudang )
    await queryRunner.manager.save( stocks_toko )
    await queryRunner.commitTransaction()
    return stocks_gudang
  } catch ( error: any ) {
    await queryRunner.rollbackTransaction()
    return await Promise.reject( new Errors( error ) )
  } finally {
    await queryRunner.release()
  }
}

export const tambahStockGudangService = async ( payload: TambahStockGudangRequestParameter ) => {
  const queryRunner = db.queryRunner()

  try {
    await queryRunner.startTransaction()
    const isProductExists = await Product.find( { where: [{ id: payload.product_id }, { vendorId: payload.vendor_id }] } )
    if ( !isProductExists.length ) throw E_ERROR.PRODUCT_NOT_FOUND_ONDB
    const stock = new Stock()
    stock.buy_price = payload.buy_price
    stock.sell_price = payload.sell_price
    stock.stock_gudang = payload.box_amount

    const stockGudangs = []

    for ( let brg = 0; brg < payload.box_amount; brg++ ) {
      const stockGudang = new StockGudang()
      stockGudang.amount = 1
      stockGudang.code = E_GUDANG_CODE_KEY.GUD_ADD_BRG_MASUK
      stockGudang.stock_id = stock.id
      stockGudangs.push( stockGudang )
    }

    await queryRunner.manager.save( stock )
    await queryRunner.manager.save( stockGudangs )
    await queryRunner.commitTransaction()

    return stock
  } catch ( error: any ) {
    await queryRunner.rollbackTransaction()
    return await Promise.reject( new Errors( error ) )
  } finally {
    await queryRunner.release()
  }
}
