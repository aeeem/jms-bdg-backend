import { Stock } from "@entity/stock";
import { UpdateExistingStockRequestParameter, UpdateStockRequestParameter } from "./stock.interfaces";
import _ from 'lodash'

export const getAllStocksService = async () => {
  try {
    return await Stock.find();
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

export const updateExistingStockService = async ({id, body} : {id: string , body: UpdateExistingStockRequestParameter}) => {
  try {
    const stock           = await Stock.findOneOrFail({ where: { id: id } });
    stock['buy_price']    = body.buy_price;
    stock['product_sku']  = body.product_sku;
    stock['total_stock']  = body.total_stock;
    stock['vendor_id']    = body.vendor_id;
    await stock.save();
    
    return await Stock.findOne({
      where: { id: body.id }
    });
  } catch (error) {
    console.error(error)
  }
}

export const updateStockService = async (body: UpdateStockRequestParameter) => {
  try {
    const existingStock = await Stock.createQueryBuilder()
    .where(
      'stock.product_sku =: product_sku AND stock.vendor_id =: vendor_id', 
      { product_sku: body.product_sku , vendor_id: body.vendor_id })
    .getOne();

    if(existingStock){
      existingStock['buy_price']    = body.buy_price;
      existingStock['total_stock']  = body.total_stock;
      await existingStock.save();
      return await Stock.findOne({
        where: { product_sku: body.product_sku, vendor_id: body.vendor_id }
      });
    } else {
      const _newStock = new Stock();
      _newStock['buy_price']    = body.buy_price;
      _newStock['total_stock']  = body.total_stock;
      _newStock['product_sku']  = body.product_sku;
      _newStock['vendor_id']    = body.vendor_id;
      await _newStock.save();
      return await Stock.findOne({
        where: { product_sku: body.product_sku, vendor_id: body.vendor_id }
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