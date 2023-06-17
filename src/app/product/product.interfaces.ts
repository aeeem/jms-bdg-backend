export interface ProductRequestParameter {
  sku: string
  name: string
  vendorId: number
  tanggalMasuk: Date
  hargaModal?: number
  hargaJual?: number
  stok?: StockPayload[]
}

interface StockPayload {
  jumlahBox: number
  berat: number
}
export interface SearchProductRequestParameter {
  query: string
}

interface StockMixProduct {
  stock_id: number
  amount: number
}
export interface MixedProductRequestParameter{
  selectedStockID: number
  stock: StockMixProduct[]
}
