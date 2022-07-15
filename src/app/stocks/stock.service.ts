import { Stock } from "@entity/stock";

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

export const findStockService = async () => {
  try {
    return await Stock.findOne();
  } catch (error) {
    console.error(error)
  }
}

export const updateStockService = async () => {
  try {
    const _updatedStock = await Stock.findOne();
    if (!_updatedStock) return { message: "Stock is not found!" };
    await _updatedStock.save();
    return await Stock.findOne({
      where: { id: _updatedStock.id }
    });
  } catch (error) {
    console.error(error)
  }
}

export const removeStockService = async () => {
  try {
    const _deletedStock = await Stock.findOne();
    if (!_deletedStock) return { message: "Stock is not found!" };
    await _deletedStock.remove();
    return { message: "Stock is deleted!" };
  } catch (error) {
    console.error(error)
  }
}