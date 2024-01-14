
export interface StockRequestParameter {
  total_stock?: number
  buy_price?: number
  sell_price?: number
  productId?: number
  vendorId?: number
}

export interface UpdateStockParameter {
  amountBox: number
  weight: number
}

export interface AddStockBulkParameter {
  stocks: UpdateStockParameter[]
}
