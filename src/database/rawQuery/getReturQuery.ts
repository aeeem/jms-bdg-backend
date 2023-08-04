import { E_GUDANG_CODE_KEY, E_TOKO_CODE_KEY } from 'src/interface/StocksCode'

export const Q_GetReturGudang = `select 
sg.id as "stock_gudang_id",p.id as "product_id",v.id as "vendor_id", sg.code as "return_code",
sg.amount , sg.created_at as "returned_at",
p.sku , p."name" as "product_name"  ,
v."name" as "vendor_name" , v.code as "vendor_code"
from stock_gudang sg
left join stock s on s.id = sg.stock_id 
left join product p on p.id = s."productId" 
left join vendor v on v.id = p."vendorId" 
where sg.code = '${E_GUDANG_CODE_KEY.GUD_ADD_BRG_RETUR}' or sg.code = '${E_GUDANG_CODE_KEY.GUD_SUB_BRG_RETUR_TO_VENDOR}'`

export const Q_GetReturToko = `select 
sg.id as "stock_toko_id",p.id as "product_id",v.id as "vendor_id", sg.code as "return_code",
sg.amount , sg.created_at as "returned_at",
p.sku , p."name" as "product_name"  ,
v."name" as "vendor_name" , v.code as "vendor_code"
from stock_toko sg
left join stock s on s.id = sg.stock_id 
left join product p on p.id = s."productId" 
left join vendor v on v.id = p."vendorId" 
where sg.code = '${E_TOKO_CODE_KEY.TOK_ADD_BRG_RETUR_FROM_CUSTOMER}' or sg.code = '${E_TOKO_CODE_KEY.TOK_SUB_BRG_RETUR}'`
