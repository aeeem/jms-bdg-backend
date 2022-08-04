import { Product } from "@entity/product";
import { Stock } from "@entity/stock";
import { Vendor } from "@entity/vendor";
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
    const vendor                            = await Vendor.findOne({where: {id: payload.vendorId}});
    console.log("payload  ", payload)
    if(!vendor) throw E_ErrorType.E_VENDOR_NOT_FOUND; 

    const query = await Product.createQueryBuilder()
      .insert()
      .into(Product)
      .values({
        sku: payload.sku,
        name: payload.name,
        arrival_date: payload.tanggalMasuk,
        stocks: {
          total_stock: payload.stok,
          buy_price: payload.hargaModal,
          sell_price: payload.hargaJual
          
        }
      })
      .execute()
    
    
    console.log(query)
    // return await Product.findOne({
    //   where: { name: payload.name }
    // });
  } catch (e:any) {
    console.log(e)
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