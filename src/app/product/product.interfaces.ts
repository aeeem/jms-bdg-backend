export type ProductRequestParameter = {
  sku: string;
  name: string;
  vendorId: number;
  tanggalMasuk: Date;
  hargaModal: number;
  hargaJual: number;
  stok: number;
}
export type SearchProductRequestParameter = { 
  query: string 
}