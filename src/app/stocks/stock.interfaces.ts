import { Stock } from "@entity/stock";


export type UpdateStockRequestParameter = Pick<Stock, "buy_price" | "product_sku" | "total_stock" | "vendor_id">
export type UpdateExistingStockRequestParameter = Pick<Stock, "id" | "buy_price" | "product_sku" | "total_stock" | "vendor_id">
export type AddStockRequestParameter = Pick<Stock, "buy_price" | "product_sku" | "total_stock" | "vendor_id">
export type RemoveStockRequestParameter = Pick<Stock, "id">
