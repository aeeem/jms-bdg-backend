import { Product } from "@entity/product";
import { E_ErrorType } from "src/errorHandler/enums";
import { ErrorHandler } from "../../errorHandler";
import { ProductRequestParameter } from "./product.interfaces";

export const getAllProductsService = async () => {
  try {
    return await Product.find({
      relations: ["stocks",'stocks.vendor']
    });
  } catch (e) {
    console.log(e)
    throw new ErrorHandler(e); 
  }
}

export const createProductService = async (payload: ProductRequestParameter) => {
  try {
    const _newProduct         = new Product();
    _newProduct['name']       = payload.name;
    _newProduct['sku']        = payload.sku
    await _newProduct.save();
    return await Product.findOne({
      where: { name: payload.name }
    });
  } catch (e:any) {
    throw new ErrorHandler(e); 
  }
}

export const searchProductService = async ({ query }: { query: string }) => {
  try {
    return await Product.createQueryBuilder('product')
      .where('product.sku LIKE :query OR product.name LIKE :query', { query: `%${query}%` })
      .orderBy('product.id', 'ASC')
      .getMany()
  } catch (e) {
    throw new ErrorHandler(e); 
  }
}

export const updateProductService = async (id: number, payload: ProductRequestParameter) => {
  try {
    const _updatedProduct   = await Product.findOne({ where: { id } });
    if (!_updatedProduct) 
      throw E_ErrorType.E_PRODUCT_NOT_FOUND;
    _updatedProduct['name'] = payload.name;
    await _updatedProduct.save();
    return await Product.findOne({
      where: { id: id }
    });
  } catch (e) {
    throw new ErrorHandler(e); 
  }
}

export const deleteProductService = async ({ id }: { id: number }) => {
  try {
    const _deletedProduct = await Product.findOne({ where: { id } });
    if (!_deletedProduct) throw E_ErrorType.E_PRODUCT_NOT_FOUND;
    await _deletedProduct.remove();
    return { message: "Product is deleted!" };
  } catch (e) {
    throw new ErrorHandler(e); 
  }
}