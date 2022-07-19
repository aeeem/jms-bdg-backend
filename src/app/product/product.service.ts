import { Product } from "@entity/product";
import { ProductRequestParameter } from "./product.interfaces";

export const getAllProductsService = async () => {
  try {
    return await Product.find();
  } catch (e) {
    console.error(e);
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
  } catch (e) {
    console.error(e);
  }
}

export const searchProductService = async ({ query }: { query: string }) => {
  try {
    return await Product.createQueryBuilder('product')
      .where('product.sku LIKE :query OR product.name LIKE :query', { query })
      .orderBy('product.id', 'ASC')
      .getMany()
  } catch (e) {
    console.error(e);
  }
}

export const updateProductService = async (id: number, payload: ProductRequestParameter) => {
  try {
    const _updatedProduct = await Product.findOne({ where: { id } });
    if (!_updatedProduct) return { message: "Product is not found!" };
    _updatedProduct['name'] = payload.name;
    await _updatedProduct.save();
    return await Product.findOne({
      where: { id: id }
    });
  } catch (e) {
    console.error(e);
  }
}

export const deleteProductService = async ({ id }: { id: number }) => {
  try {
    const _deletedProduct = await Product.findOne({ where: { id } });
    if (!_deletedProduct) return { message: "Product is not found!" };
    await _deletedProduct.remove();
    return { message: "Product is deleted!" };
  } catch (e) {
    console.error(e);
  }
}