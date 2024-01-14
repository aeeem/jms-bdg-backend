import { Stock } from '@entity/stock'
import {
  AddStockBulkParameter, StockRequestParameter, UpdateStockParameter
} from './stock.interfaces'
import _ from 'lodash'
import makeResponse from 'src/helper/response'
import { E_ERROR } from 'src/constants/errorTypes'
import { Errors } from 'src/errorHandler'
import { db } from 'src/app'
import { Product } from '@entity/product'
import { StockGudang } from '@entity/stockGudang'
import { E_GUDANG_CODE_KEY } from 'src/interface/StocksCode'

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

export const addStockBulkService = async ( productID: number, payload: AddStockBulkParameter ) => {
  const queryRunner = db.queryRunner()
  try {
    const product = await Product.findOne( { where: { id: productID }, relations: ['stocks'] } )

    if ( product == null ) throw E_ERROR.PRODUCT_NOT_FOUND
    
    const stocks = await Promise.all( payload.stocks.map( async it => {
      const newStock = new Stock()
      newStock.buy_price = product.stocks[0].buy_price
      newStock.sell_price = product.stocks[0].sell_price
      newStock.weight = it.weight
      newStock.stock_gudang = it.amountBox
      newStock.productId = productID
      return newStock
    } ) )

    const insertedStocks = await queryRunner.manager.save( stocks )

    const stockGudang = await Promise.all( insertedStocks.map( async stock => {
      const newStockGudang = new StockGudang()
      newStockGudang.amount = stock.stock_gudang
      newStockGudang.code = E_GUDANG_CODE_KEY.GUD_ADD_BRG_MASUK
      newStockGudang.stock_id = stock.id

      return newStockGudang
    } ) )

    await queryRunner.manager.save( stockGudang )

    return makeResponse.success( {
      data: stocks, stat_code: 200, stat_msg: 'Stock added successfully!'
    } )
  } catch ( error: any ) {
    console.log( error )
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
    stock.stock_gudang = body.total_stock ? body.total_stock : stock.stock_gudang
    await stock.save()
    
    return await Stock.findOne( { where: { id } } )
  } catch ( error: any ) {
    return new Errors( error )
  }
}

export const updateStockService = async ( body: UpdateStockParameter, id: string ) => {
  try {
    const existingStock = await Stock.findOne( { where: { id } } )
    if ( existingStock != null ) {
      // existingStock.productId = body.productId ? body.productId : existingStock.productId
      // existingStock.buy_price = body.buy_price ? body.buy_price : existingStock.buy_price
      // existingStock.stock_gudang = body.total_stock ? body.total_stock : existingStock.stock_gudang
      // existingStock.sell_price = body.sell_price ? body.sell_price : existingStock.sell_price
      existingStock.stock_gudang = body.amountBox
      existingStock.weight = body.weight
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

export const getStockTokoService = async () => {
  try {
    const stocks = await Stock.find( { relations: ['product', 'product.vendor'] } )

    const filteredStockToko = stocks.filter( stock => stock.stock_toko > 0 ).map( item => {
      return {
        ...item,
        gudang: false
      }
    } )
    const filteredStockGudang = stocks.filter( stock => stock.stock_gudang > 0 )
      .map( item => {
        return {
          ...item,
          gudang: true
        }
      } )

    const mergeStock = [...filteredStockToko, ...filteredStockGudang]
    
    return mergeStock
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
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
