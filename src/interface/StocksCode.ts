/* eslint-disable no-multi-spaces */

export enum E_GUDANG_CODE_KEY {
  'GUD_ADD_BRG_MASUK'         = 'GUD_ADD_BRG_MASUK', // 'Barang Masuk ke gudang'
  'GUD_ADD_BRG_RETUR'         = 'GUD_ADD_BRG_RETUR', // Barang retur dari toko
  'GUD_SUB_BRG_KELUAR'        = 'GUD_SUB_BRG_KELUAR', // Barang keluar dari gudang
  'GUD_SUB_BRG_PIN_TOKO'      = 'GUD_SUB_BRG_PIN_TOKO', // Barang pindah ke toko
  'GUD_SUB_BRG_HAPUS'         = 'GUD_SUB_BRG_HAPUS', // Barang dihapus dari gudang,
  'GUD_SUB_BRG_TRANSAKSI'     = 'GUD_SUB_BRG_TRANSAKSI', // Barang dihapus dari gudang

}

export enum E_TOKO_CODE_KEY {
  'TOK_ADD_BRG_PENDING_TRANSAKSI' = 'TOK_ADD_BRG_PENDING_TRANSAKSI',
  'TOK_ADD_BRG_MASUK'    = 'TOK_ADD_BRG_MASUK', // Barang masuk dari gudang
  'TOK_SUB_TRANSAKSI'    = 'TOK_SUB_TRANSAKSI', // Barang digunakan untuk transaksi
  'TOK_SUB_BRG_RETUR'    = 'TOK_SUB_BRG_RETUR', // Barang retur ke gudang
  'TOK_SUB_BRG_PENDING_TRANSAKSI' = 'TOK_SUB_BRG_PENDING_TRANSAKSI'
  
}
