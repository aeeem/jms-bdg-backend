import { Product } from "@entity/product";
import { Stock } from "@entity/stock";
import { Vendor } from "@entity/vendor";
import { E_ErrorType } from "src/errorHandler/enums";
import makeResponse from "src/helper/response";
import { ErrorHandler } from "../../errorHandler";
import { ProductRequestParameter } from "./product.interfaces";

export const getAllProductsService = async () => {
  try {
    const products = await Product.find({
        relations: ["stock",'stock.vendor']
      })
    return makeResponse.success<Product[]>({data:products, stat_msg:"SUCCESS"});
  } catch (e) {
    console.log(e)
    throw new ErrorHandler(e); 
  }
}

export const createProductService = async (payload: ProductRequestParameter) => {
  try {
    const vendor = await Vendor.findOne({where: {id: payload.vendorId}});

    if(!vendor) throw E_ErrorType.E_VENDOR_NOT_FOUND; 
    const stock = new Stock();
    stock.buy_price   = payload.hargaModal;
    stock.sell_price  = payload.hargaJual;
    stock.total_stock = payload.stok;
    stock.vendorId    = payload.vendorId

    const newProduct        = new Product();
    newProduct.sku          = payload.sku;
    newProduct.name         = payload.name;
    newProduct.arrival_date = payload.tanggalMasuk;
    newProduct.stock        = stock;
    await newProduct.save();

    return newProduct
  } catch (e:any) {
    console.log(e)
    throw new ErrorHandler(e); 
  }
}

export const searchProductService = async ({ query }: { query: string }) => {
  try {
    const products = await Product.createQueryBuilder('product')
      .where('product.sku LIKE :query OR product.name LIKE :query', { query: `%${query}%` })
      .leftJoinAndSelect('product.stock', 'stock')
      .leftJoinAndSelect('stock.vendor', 'vendor')
      .orderBy('product.id', 'ASC')
      .getMany()
      return makeResponse.success<Product[]>({data:products, stat_msg:"SUCCESS"});
  } catch (e) {
    throw new ErrorHandler(e); 
  }
}

export const updateProductService = async (id: number, payload: ProductRequestParameter) => {
  try {
    const _updatedProduct   = await Product.findOne({ where: { id } });
    const _updatedStock   = await Stock.findOne({ where: { productId: id } });
    if(!_updatedStock)
      throw E_ErrorType.E_STOCK_NOT_FOUND;
    _updatedStock['buy_price'] = payload.hargaModal;
    _updatedStock['sell_price'] = payload.hargaJual;
    _updatedStock['total_stock'] = payload.stok
    _updatedStock['vendorId'] = payload.vendorId

    if (!_updatedProduct) 
      throw E_ErrorType.E_PRODUCT_NOT_FOUND;
    _updatedProduct['name'] = payload.name;
    _updatedProduct['sku'] = payload.sku
    _updatedProduct['arrival_date'] = payload.tanggalMasuk
    _updatedProduct['stock'] = _updatedStock
  
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