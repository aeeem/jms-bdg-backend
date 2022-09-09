export interface ProductRequestParameter {
  sku: string
  name: string
  vendorId: number
  tanggalMasuk: Date
  hargaModal: number
  hargaJual: number
  stok: number
}
export interface SearchProductRequestParameter {
  query: string
}
