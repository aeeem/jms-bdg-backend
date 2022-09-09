import { Stock } from '@entity/stock'
import { StockRequestParameter } from './stock.interfaces'
import _ from 'lodash'
import makeResponse from 'src/helper/response'
import { E_ERROR } from 'src/constants/errorTypes'
import { Errors } from 'src/errorHandler'

export const getAllStocksService = async () => {
  try {
    return await Stock.find( { relations: ['vendor', 'product'] } )
  } catch ( error: any ) {
    return new Errors( error )
  }
}

export const addStockService = async () => {
  try {
    const _newStock = new Stock()
    await _newStock.save()
    return await Stock.findOne( { where: { id: _newStock.id } } )
  } catch ( error: any ) {
    return new Errors( error )
  }
}

export const findStockService = async ( query: string ) => {
  try {
    const stock = await Stock.createQueryBuilder()
      .leftJoinAndMapMany( 'product', 'Product', 'product.id = stock.product_sku' )
      .leftJoinAndMapMany( 'vendor', 'Vendor', 'vendor.id = stock.vendor_id' )
      .where( 'stock.product_sku LIKE :query OR stock.vendor_id LIKE :query', { query } )
      .getMany()
      
    if ( _.isEmpty( stock ) ) return { message: 'Stock is not found!' }
    return stock
  } catch ( error: any ) {
    return new Errors( error )
  }
}

export const updateExistingStockService = async ( { id, body }: {id: string, body: StockRequestParameter} ) => {
  try {
    const stock = await Stock.findOneOrFail( { where: { id } } )
    stock.buy_price = body.buy_price ? body.buy_price : stock.buy_price
    stock.total_stock = body.total_stock ? body.total_stock : stock.total_stock
    await stock.save()
    
    return await Stock.findOne( { where: { id } } )
  } catch ( error: any ) {
    return new Errors( error )
  }
}

export const updateStockService = async ( body: StockRequestParameter, id: string ) => {
  try {
    const existingStock = await Stock.findOne( { where: { id } } )
    if ( existingStock != null ) {
      existingStock.vendorId = body.vendorId ? body.vendorId : existingStock.vendorId
      existingStock.productId = body.productId ? body.productId : existingStock.productId
      existingStock.buy_price = body.buy_price ? body.buy_price : existingStock.buy_price
      existingStock.total_stock = body.total_stock ? body.total_stock : existingStock.total_stock
      existingStock.sell_price = body.sell_price ? body.sell_price : existingStock.sell_price
      await existingStock.save()
      const stock = await Stock.findOne( { where: { id: existingStock.id } } )
      if ( stock != null ) {
        return makeResponse.success( {
          data: stock, stat_code: 200, stat_msg: 'Stock updated successfully!'
        } )
      }
    }

    throw E_ERROR.PRODUCT_OR_VENDOR_NOT_FOUND
  } catch ( error: any ) {
    return new Errors( error )
  }
}

export const removeStockService = async ( { id }: {id: string} ) => {
  try {
    const _deletedStock = await Stock.findOne( { where: { id } } )
    if ( _deletedStock == null ) return { message: 'Stock is not found!' }
    await _deletedStock.remove()
    return { message: 'Stock is deleted!' }
  } catch ( error: any ) {
    return new Errors( error )
  }
}
