import { Stock } from "@entity/stock";
import { StockRequestParameter } from "./stock.interfaces";
import _ from 'lodash'
import { Product } from "@entity/product";
import { Vendor } from "@entity/vendor";
import { E_ErrorType } from "src/errorHandler";

export const getAllStocksService = async () => {
  try {
    return await Stock.find({
      relations: ["vendor","product"]
    });
  } catch (error) {
    console.error(error)
  }
}

export const addStockService = async () => {
  try {
    const _newStock = new Stock();
    await _newStock.save();
    return await Stock.findOne({
      where: { id: _newStock.id }
    });
  } catch (error) {
    console.error(error)
  }
}

export const findStockService = async (query: string) => {
  try {
    const stock = await Stock.createQueryBuilder()
      .leftJoinAndMapMany('product', 'Product', 'product.id = stock.product_sku')
      .leftJoinAndMapMany('vendor', 'Vendor', 'vendor.id = stock.vendor_id')
      .where('stock.product_sku LIKE :query OR stock.vendor_id LIKE :query', { query })
      .getMany();
      
      if(_.isEmpty(stock)) return { message: "Stock is not found!" };
      return stock
  } catch (error) {
    console.error(error)
  }
}

export const updateExistingStockService = async ({id, body} : {id: string , body: StockRequestParameter}) => {
  try {
    const stock           = await Stock.findOneOrFail({ where: { id: id } });
    stock['buy_price']    = body.buy_price;
    stock['total_stock']  = body.total_stock;
    await stock.save();
    
    return await Stock.findOne({
      where: { id }
    });
  } catch (error) {
    console.error(error)
  }
}

export const updateStockService = async (body: StockRequestParameter) => {
  try {
    const product   = await Product.findOne({ where: { id: body.productId } });
    const vendor    = await Vendor.findOne({ where: { id: body.vendorId } });

    if(!product || !vendor) throw E_ErrorType.E_PRODUCT_OR_VENDOR_NOT_FOUND;

    const existingStock = await Stock.findOne({
      where: {
        product,
        vendor
      }
    });

    if(existingStock){
      existingStock['buy_price']    = body.buy_price;
      existingStock['total_stock']  = body.total_stock;
      await existingStock.save();
      return await Stock.findOne({
        where: { id: existingStock.id }
      });
    } else {
      const _newStock = new Stock();
      _newStock['buy_price']      = body.buy_price;
      _newStock['total_stock']    = body.total_stock;
      _newStock.product = product;
      _newStock.vendor = vendor;
      await _newStock.save();
      return await Stock.findOne({
        where: { id: _newStock.id }
      });
    }
  } catch (error) {
    console.error(error)
  }
}

export const removeStockService = async ({id}: {id:string}) => {
  try {
    const _deletedStock = await Stock.findOne({where: {id}});
    if(!_deletedStock) return { message: "Stock is not found!"}
    await _deletedStock.remove();
    return { message: "Stock is deleted!" }
  } catch (error) {
    console.error(error)
  }
}