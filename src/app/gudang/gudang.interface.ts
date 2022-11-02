export interface TambahStockGudangRequestParameter {
  product_id: number
  vendor_id: number
  buy_price: number
  sell_price: number
  box_amount: number
}

export interface PindahStockGudangRequestParameter {
  stock_ids: number[]
}
