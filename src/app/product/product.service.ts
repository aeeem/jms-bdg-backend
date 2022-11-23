import { Product } from '@entity/product'
import { Stock } from '@entity/stock'
import { StockToko } from '@entity/stockToko'
import { StockGudang } from '@entity/stockGudang'
import { Vendor } from '@entity/vendor'
import { db } from 'src/app'
import { E_ERROR } from 'src/constants/errorTypes'
import makeResponse from 'src/helper/response'
import { E_TOKO_CODE_KEY, E_GUDANG_CODE_KEY } from 'src/interface/StocksCode'
import { Errors } from '../../errorHandler'
import { MixedProductRequestParameter, ProductRequestParameter } from './product.interfaces'

export const getAllProductsService = async () => {
  try {
    const products = await Product.find( { relations: ['stocks', 'vendor'] } )
    return makeResponse.success<Product[]>( { data: products, stat_msg: 'SUCCESS' } )
  } catch ( e: any ) {
    throw new Errors( e )
  }
}

export const createProductService = async ( payload: ProductRequestParameter[] ) => {
  try {
    const new_products = await Promise.all( payload.map( async product => {
      const vendor = await Vendor.findOne( { where: { id: product.vendorId } } )

      if ( vendor == null ) throw E_ERROR.NOT_FOUND

      const stockGudang: StockGudang[] = []
      const stock: Stock[] = []
      product.stok.forEach( item => {
        const newStockGudang = new StockGudang()
        const newStock = new Stock()
        newStock.buy_price = product.hargaModal
        newStock.sell_price = product.hargaJual
        newStock.weight = item.berat
        newStockGudang.amount = item.jumlahBox
        newStockGudang.code = E_GUDANG_CODE_KEY.GUD_ADD_BRG_MASUK
        newStockGudang.stock = newStock
        
        stock.push( newStock )
        stockGudang.push( newStockGudang )
      } )
      
      const newProduct = new Product()
      newProduct.sku = product.sku
      newProduct.name = product.name
      newProduct.arrival_date = product.tanggalMasuk
      newProduct.stocks = stock

      return newProduct
    } ) )

    await Product.save( new_products )

    return new_products
  } catch ( e: any ) {
    throw new Errors( e )
  }
}

export const searchProductService = async ( { query }: { query: string } ) => {
  try {
    const products = await Product.createQueryBuilder( 'product' )
      .where( 'product.sku LIKE :query OR product.name LIKE :query', { query: `%${query}%` } )
      .leftJoinAndSelect( 'product.stock', 'stock' )
      .leftJoinAndSelect( 'stock.vendor', 'vendor' )
      .orderBy( 'product.id', 'ASC' )
      .getMany()
    return makeResponse.success<Product[]>( { data: products, stat_msg: 'SUCCESS' } )
  } catch ( e: any ) {
    throw new Errors( e )
  }
}

export const updateProductService = async ( id: number, payload: ProductRequestParameter ) => {
  try {
    const _updatedProduct = await Product.findOne( { where: { id } } )
    const _updatedStock = await Stock.findOne( { where: { productId: id } } )
    if ( _updatedStock == null ) { throw E_ERROR.STOCK_NOT_FOUND }
    _updatedStock.buy_price = payload.hargaModal
    _updatedStock.sell_price = payload.hargaJual

    if ( _updatedProduct == null ) { throw E_ERROR.PRODUCT_NOT_FOUND }
    _updatedProduct.name = payload.name
    _updatedProduct.sku = payload.sku
    _updatedProduct.arrival_date = payload.tanggalMasuk
    _updatedProduct.stocks = [_updatedStock]
  
    await _updatedProduct.save()
    return await Product.findOne( { where: { id } } )
  } catch ( e: any ) {
    throw new Errors( e )
  }
}

export const deleteProductService = async ( { id }: { id: number } ) => {
  try {
    const _deletedProduct = await Product.findOne( { where: { id } } )
    if ( _deletedProduct == null ) throw E_ERROR.PRODUCT_NOT_FOUND
    await _deletedProduct.remove()
    return { message: 'Product is deleted!' }
  } catch ( e: any ) {
    throw new Errors( e )
  }
}

export const addMixedProductService = async ( payload: MixedProductRequestParameter[] ) => {
  const queryRunner = db.queryRunner()
  try {
    await queryRunner.startTransaction()
    const stocks = Promise.all( payload.map( async item => {
      const isProductExist = await Stock.findOne( { where: { sku: item.sku }, relations: ['stock'] } )
      if ( isProductExist ) {
        const stock_toko = new StockToko()
        stock_toko.amount = item.amount
        stock_toko.code = E_TOKO_CODE_KEY.TOK_ADD_BRG_MASUK
        return stock_toko
      }
    } ) )
    await queryRunner.manager.save( stocks )
    await queryRunner.commitTransaction()
    return await stocks
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  } finally {
    await queryRunner.release()
  }
}
