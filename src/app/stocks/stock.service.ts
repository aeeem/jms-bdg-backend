import { Stock } from '@entity/stock'
import { AddStockBulkParameter, StockRequestParameter } from './stock.interfaces'
import _, { toInteger } from 'lodash'
import makeResponse from 'src/helper/response'
import { E_ERROR } from 'src/constants/errorTypes'
import { Errors } from 'src/errorHandler'
import { db } from 'src/app'
import { Product } from '@entity/product'
import { StockGudang } from '@entity/stockGudang'
import { E_GUDANG_CODE_KEY } from 'src/interface/StocksCode'

export const getAllStocksService = async (
  offset: number,
  limit: number,
  orderByColumn: string,
  Order?: string,
  search?: string,
  vendor?: number,
  dateTo?: string,
  dateFrom?: string
) => {
  try {
    // ROW(u.*, ROW(ur.*, d AS duty) AS user_role)
    const qbStock = Stock.createQueryBuilder( 'stock' )
      .select( ['stock.*', 'json_agg(row_to_json(product.*))::json->0 as product'] )
      .leftJoin(
        selectqueryBuilder =>
          selectqueryBuilder
            .select( ['product.*', 'row_to_json(vendor.*) as vendor'] )
            .leftJoin( 'vendor', 'vendor', 'product.vendorId = vendor.id' )
            .from( 'product', 'product' )
            .groupBy( 'product.id,vendor.id' ),
        'product',
        'stock.productId = product.id'
      )
      .groupBy( 'stock.id,product.id' )

    if ( vendor ) {
      qbStock.where( 'stock.vendorId = :vendor', { vendor } )
    }
    if ( search ) {
      qbStock.where(
        'LOWER(stock.name) ILIKE :query OR LOWER(stock.sku) ILIKE :query',
        { query: `%${search}%` }
      )
    }
    if ( dateFrom ) {
      qbStock.where( 'stock.created_at::date <= :dateFrom', { dateFrom } )
    }
    if ( dateTo ) {
      qbStock.where( 'stock.created_at::date >= :dateTo', { dateTo } )
    }
    const stock = await qbStock
      .orderBy( `stock.${orderByColumn}`, Order === 'DESC' ? 'DESC' : 'ASC' )
      .limit( limit )
      .offset( offset )
      .getRawMany()
    const count = await qbStock.getCount()
    return { stock, count }
  } catch ( e: any ) {
    throw new Errors( e )
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

export const updateStockService = async ( body: {
  is_gudang: boolean
  amountBox: number
  weight: number
}, id: string ) => {
  try {
    const existingStock = await Stock.findOne( { where: { id } } )
    if ( existingStock != null ) {
      if ( body.is_gudang ) {
        existingStock.stock_gudang = body.amountBox
        existingStock.weight = body.weight
      } else {
        existingStock.stock_toko = body.weight
      }
     
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

export const getStockTokoService = async (
  offset: number,
  limit: number,
  orderByColumn: string,
  searchBy?: 'sku' | string,
  stockType?: 'toko' | 'gudang' | string,
  Order?: string,
  search?: string,
  vendor?: number,
  dateTo?: string,
  dateFrom?: string
) => {
  try {
    let qbStockToko = Product.createQueryBuilder()
      .from( 'stock', 'stock' )
      .leftJoin(
        selectqueryBuilder =>
          selectqueryBuilder
            .select( ['product.*', 'row_to_json(vendor.*) as vendor'] )
            .leftJoin( 'vendor', 'vendor', 'product.vendorId = vendor.id' )
            .from( 'product', 'product' )
            .groupBy( 'product.id,vendor.id' ),
        'product',
        'stock.productId = product.id'
      )
      .groupBy( 'stock.id,product.id' )
    
    qbStockToko = qbStockToko
      .select( ['stock.*', 'json_agg(row_to_json(product.*))::json->0 as product'] )
    
    if ( vendor ) {
      qbStockToko = qbStockToko.andWhere(
        '"product"."vendorId" = ' + String( vendor ) )
    }

    if ( search ) {
      if ( searchBy === 'sku' ) {
        qbStockToko = qbStockToko.andWhere(
          '(LOWER("product"."sku") ILIKE ' + `'%${search}%')`
        )
      }
      else if ( searchBy === 'id' ) {
        qbStockToko = qbStockToko.andWhere(
          'stock.id=:id', { id:toInteger(search) } 
        )
      } else {
        qbStockToko = qbStockToko.andWhere(
          '(LOWER("product"."sku") ILIKE ' +
            `'%${search}%'` +
            'OR LOWER("product"."name") ILIKE ' +
            `'%${search}%')`
        )
      }
    }
    if ( stockType === 'toko' ) {
      qbStockToko = qbStockToko.andWhere( 'stock.stock_toko > 0' )
    } else if ( stockType === 'gudang' ) {
      // qbStockGudangFalse = qbStockGudangFalse.andWhere( 'stock.stock_gudang > 0' )
      qbStockToko = qbStockToko.andWhere( 'stock.stock_gudang > 0' )
    } else {
      qbStockToko = qbStockToko
        .andWhere( '(stock.stock_toko > 0 OR stock.stock_gudang > 0)' )
    }
    if ( dateFrom ) {
      qbStockToko = qbStockToko.andWhere(
        'stock.created_at::date <= :dateFrom',
        { dateFrom }
      )
    }
    if ( dateTo ) {
      qbStockToko = qbStockToko.andWhere(
        'stock.created_at::date >= :dateTo',
        { dateTo }
      )
    }
    const stockQb = qbStockToko
      .offset( offset )
      .orderBy( `stock.${orderByColumn}`, Order === 'DESC' ? 'DESC' : 'ASC' )
      .limit( limit )

    const stock = await stockQb.getRawMany()
    const count = await stockQb.getCount()
    return { stock, count }
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
