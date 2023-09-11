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
    const products = await Product.find( {
      relations: ['stocks', 'vendor'],
      order    : { created_at: 'DESC' }
    } )
    return makeResponse.success<Product[]>( { data: products, stat_msg: 'SUCCESS' } )
  } catch ( e: any ) {
    throw new Errors( e )
  }
}

export const createProductService = async ( payload: ProductRequestParameter[] ) => {
  const queryRunner = db.queryRunner()

  try {
    await queryRunner.startTransaction()
    
    const new_products = await Promise.all( payload.map( async product => {
      const vendor = await Vendor.findOne( { where: { id: product.vendorId } } )

      if ( vendor == null ) throw E_ERROR.VENDOR_NOT_FOUND

      const stocks = product?.stok?.map( item => {
        const newStock = new Stock()
        newStock.buy_price = product.hargaModal ?? 0
        newStock.sell_price = product.hargaJual ?? 0
        newStock.weight = item.berat
        return newStock
      } )

      const insertedStocks = await queryRunner.manager.save( stocks ) as Stock[]

      const stockGudang = await Promise.all( insertedStocks.map( async ( stock, index ) => {
        const newStockGudang = new StockGudang()
        newStockGudang.amount = product.stok ? product.stok[index].jumlahBox : 0
        newStockGudang.code = E_GUDANG_CODE_KEY.GUD_ADD_BRG_MASUK
        newStockGudang.stock_id = stock.id

        stock.stock_gudang += product.stok ? product.stok[index].jumlahBox : 0

        await queryRunner.manager.save( stock )

        return newStockGudang
      } ) )
      
      const newProduct = new Product()
      newProduct.sku = product.sku
      newProduct.name = product.name
      newProduct.arrival_date = product.tanggalMasuk
      newProduct.stocks = stocks ?? []
      newProduct.vendorId = product.vendorId
      
      await queryRunner.manager.save( stockGudang )

      return newProduct
    } ) )
    await queryRunner.manager.save( new_products )
    await queryRunner.commitTransaction()

    return new_products
  } catch ( e: any ) {
    await queryRunner.rollbackTransaction()
    return await Promise.reject( new Errors( e ) )
  } finally {
    await queryRunner.release()
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
    // const _updatedStock = await Stock.findOne( { where: { productId: id } } )
    // if ( _updatedStock == null ) { throw E_ERROR.STOCK_NOT_FOUND }
    // _updatedStock.buy_price = payload.hargaModal
    // _updatedStock.sell_price = payload.hargaJual

    if ( _updatedProduct == null ) { throw E_ERROR.PRODUCT_NOT_FOUND }
    _updatedProduct.name = payload.name
    _updatedProduct.sku = payload.sku
    _updatedProduct.arrival_date = payload.tanggalMasuk
    _updatedProduct.vendorId = payload.vendorId
    // _updatedProduct.stocks = [_updatedStock]
  
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

export const addMixedProductService = async ( payload: MixedProductRequestParameter ) => {
  const queryRunner = db.queryRunner()
  try {
    await queryRunner.startTransaction()
    
    const sumStock = payload.stock.reduce( ( prev, next ) => prev + next.amount, 0 )

    const stocks = await Promise.all( payload.stock.map( async item => {
      const isProductExist = await Stock.findOne( { where: { id: item.stock_id } } )
      if ( isProductExist ) {
        const stock_toko = new StockToko()
        stock_toko.stock_id = item.stock_id
        stock_toko.amount = item.stock_id === payload.selectedStockID ? sumStock : item.amount
        stock_toko.code = item.stock_id === payload.selectedStockID ? E_TOKO_CODE_KEY.TOK_ADD_MIX : E_TOKO_CODE_KEY.TOK_SUB_MIX

        return stock_toko
      }
    } ) )
    await queryRunner.manager.save( stocks )
    await queryRunner.commitTransaction()

    return stocks
  } catch ( error: any ) {
    return await Promise.reject( new Errors( error ) )
  } finally {
    await queryRunner.release()
  }
}
