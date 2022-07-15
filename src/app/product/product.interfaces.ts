import { Product } from "@entity/product";

export type CreateProductRequestParameter = Pick<Product, "sku" | "name">
export type SearchProductRequestParameter = { query: string }