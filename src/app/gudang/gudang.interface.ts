export interface TambahStockGudangRequestParameter {
  product_id: number
  vendor_id: number
}

export interface PindahStockGudangRequestParameter {
  stock_ids: number[]
}
