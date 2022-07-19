import { Product } from "@entity/product";

export type ProductRequestParameter = {
  sku: string;
  name: string;
}
export type SearchProductRequestParameter = { 
  query: string 
}