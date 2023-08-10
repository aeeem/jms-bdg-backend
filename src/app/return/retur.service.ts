import { Stock } from '@entity/stock'
import { ReturCustomerRequestParameter, ReturRequestParameter } from './retur.interface'
import { E_ERROR } from 'src/constants/errorTypes'
import { StockGudang } from '@entity/stockGudang'
import { E_GUDANG_CODE_KEY, E_TOKO_CODE_KEY } from 'src/interface/StocksCode'
import { StockToko } from '@entity/stockToko'
import { db } from 'src/app'
import { Q_GetReturGudang, Q_GetReturToko } from 'src/database/rawQuery/getReturQuery'
import dayjs from 'dayjs'

export const getListReturService = async () => {
  const stock_gudang = await db.connection.query( Q_GetReturGudang )
  const stock_toko = await db.connection.query( Q_GetReturToko )
  const listReturn = [...stock_gudang, ...stock_toko].sort( ( a, b ) => ( dayjs( a?.returned_at ).isAfter( dayjs( b?.returned_at ) ) ? -1 : 1 ) )

  return listReturn
}

export const addReturItemVendorService = async ( payload: ReturRequestParameter ) => {
  const stock = await Stock.findOne( { where: { id: payload.stock_id } } )
  if ( !stock ) throw E_ERROR.STOCK_NOT_FOUND
  if ( stock.stock_gudang - payload.amount < 1 ) throw E_ERROR.INSUFFICIENT_STOCK_GDG
  
  const record_gudang = new StockGudang() // membuat entry baru pada table stock gudang
  stock.stock_gudang -= payload.amount // kurangi stock gudang pada master stock
  record_gudang.amount = payload.amount
  record_gudang.code = E_GUDANG_CODE_KEY.GUD_SUB_BRG_RETUR_TO_VENDOR
  record_gudang.stock_id = stock.id

  await record_gudang.save()
  await stock.save()
}

export const addReturItemCustomerService = async ( payload: ReturCustomerRequestParameter ) => {
  const stock = await Stock.findOne( { where: { id: payload.stock_id } } )
  if ( !stock ) throw E_ERROR.STOCK_NOT_FOUND
  if ( payload.is_gudang && stock.stock_gudang - payload.amount < 1 ) throw E_ERROR.INSUFFICIENT_STOCK_GDG
  if ( !payload.is_gudang && stock.stock_toko - payload.amount < 1 ) throw E_ERROR.INSUFFICIENT_STOCK
  
  if ( payload.is_gudang ) {
    const record_gudang = new StockGudang() // membuat entry baru pada table stock gudang
    stock.stock_gudang += payload.amount // kurangi stock gudang pada master stock
    record_gudang.amount = payload.amount
    record_gudang.code = E_GUDANG_CODE_KEY.GUD_ADD_BRG_RETUR
    record_gudang.stock_id = stock.id
    await record_gudang.save()
  } else {
    const record_toko = new StockToko()
    stock.stock_toko = Number( stock.stock_toko ) + payload.amount
    record_toko.amount = payload.amount
    record_toko.code = E_TOKO_CODE_KEY.TOK_ADD_BRG_RETUR_FROM_CUSTOMER
    record_toko.stock_id = stock.id
    await record_toko.save()
  }
  await stock.save()
}
