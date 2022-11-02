import { Product } from '@entity/product'
import { Stock } from '@entity/stock'
import { StockGudang } from '@entity/stockGudang'
import { Vendor } from '@entity/vendor'
import { E_ERROR } from 'src/constants/errorTypes'
import { Errors } from 'src/errorHandler'
import { E_GUDANG_CODE_KEY } from 'src/interface/StocksCode'
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

export const pindahStockGudangService = async ( payload: PindahStockGudangRequestParameter ) => {
  try {
    const stocks_gudang = payload.stock_ids.map( stock_id => {
      const item_gudang = new StockGudang()
      item_gudang.amount = 1
      item_gudang.code = E_GUDANG_CODE_KEY.GUD_SUB_BRG_PIN_TOKO
      item_gudang.stock_id = stock_id
      return item_gudang
    } )
    const stocks = await StockGudang.create( stocks_gudang )
    return stocks
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}

export const tambahStockGudangService = async ( payload: TambahStockGudangRequestParameter ) => {
  try {
    const isProductExists = await Product.find( { where: [{ id: payload.product_id }, { vendorId: payload.vendor_id }] } )
    if ( !isProductExists.length ) throw E_ERROR.PRODUCT_NOT_FOUND_ONDB
    const stock = new StockGudang()
    stock.amount = 1
    stock.code = E_GUDANG_CODE_KEY.GUD_ADD_BRG_MASUK
    
    return stocks
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  }
}
