"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeStockService = exports.getStockTokoService = exports.updateStockService = exports.updateExistingStockService = exports.findStockService = exports.addStockBulkService = exports.addStockService = exports.getAllStocksService = void 0;
const stock_1 = require("@entity/stock");
const lodash_1 = __importDefault(require("lodash"));
const response_1 = __importDefault(require("src/helper/response"));
const errorTypes_1 = require("src/constants/errorTypes");
const errorHandler_1 = require("src/errorHandler");
const app_1 = require("src/app");
const product_1 = require("@entity/product");
const stockGudang_1 = require("@entity/stockGudang");
const StocksCode_1 = require("src/interface/StocksCode");
const getAllStocksService = async () => {
    try {
        return await stock_1.Stock.find({ relations: ['vendor', 'product'] });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
};
exports.getAllStocksService = getAllStocksService;
const addStockService = async () => {
    try {
        const _newStock = new stock_1.Stock();
        await _newStock.save();
        return await stock_1.Stock.findOne({ where: { id: _newStock.id } });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
};
exports.addStockService = addStockService;
const addStockBulkService = async (productID, payload) => {
    const queryRunner = app_1.db.queryRunner();
    try {
        const product = await product_1.Product.findOne({ where: { id: productID }, relations: ['stocks'] });
        if (product == null)
            throw errorTypes_1.E_ERROR.PRODUCT_NOT_FOUND;
        const stocks = await Promise.all(payload.stocks.map(async (it) => {
            const newStock = new stock_1.Stock();
            newStock.buy_price = product.stocks[0].buy_price;
            newStock.sell_price = product.stocks[0].sell_price;
            newStock.weight = it.weight;
            newStock.stock_gudang = it.amountBox;
            newStock.productId = productID;
            return newStock;
        }));
        const insertedStocks = await queryRunner.manager.save(stocks);
        const stockGudang = await Promise.all(insertedStocks.map(async (stock) => {
            const newStockGudang = new stockGudang_1.StockGudang();
            newStockGudang.amount = stock.stock_gudang;
            newStockGudang.code = StocksCode_1.E_GUDANG_CODE_KEY.GUD_ADD_BRG_MASUK;
            newStockGudang.stock_id = stock.id;
            return newStockGudang;
        }));
        await queryRunner.manager.save(stockGudang);
        return response_1.default.success({
            data: stocks, stat_code: 200, stat_msg: 'Stock added successfully!'
        });
    }
    catch (error) {
        console.log(error);
        return new errorHandler_1.Errors(error);
    }
};
exports.addStockBulkService = addStockBulkService;
const findStockService = async (query) => {
    try {
        const stock = await stock_1.Stock.createQueryBuilder()
            .leftJoinAndMapMany('product', 'Product', 'product.id = stock.product_sku')
            .leftJoinAndMapMany('vendor', 'Vendor', 'vendor.id = stock.vendor_id')
            .where('stock.product_sku LIKE :query OR stock.vendor_id LIKE :query', { query })
            .getMany();
        if (lodash_1.default.isEmpty(stock))
            return { message: 'Stock is not found!' };
        return stock;
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
};
exports.findStockService = findStockService;
const updateExistingStockService = async ({ id, body }) => {
    try {
        const stock = await stock_1.Stock.findOneOrFail({ where: { id } });
        stock.buy_price = body.buy_price ? body.buy_price : stock.buy_price;
        stock.stock_gudang = body.total_stock ? body.total_stock : stock.stock_gudang;
        await stock.save();
        return await stock_1.Stock.findOne({ where: { id } });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
};
exports.updateExistingStockService = updateExistingStockService;
const updateStockService = async (body, id) => {
    try {
        const existingStock = await stock_1.Stock.findOne({ where: { id } });
        if (existingStock != null) {
            if (body.is_gudang) {
                existingStock.stock_gudang = body.amountBox;
                existingStock.weight = body.weight;
            }
            else {
                existingStock.stock_toko = body.weight;
                console.log('here');
            }
            await existingStock.save();
            const stock = await stock_1.Stock.findOne({ where: { id: existingStock.id } });
            if (stock != null) {
                return response_1.default.success({
                    data: stock, stat_code: 200, stat_msg: 'Stock updated successfully!'
                });
            }
        }
        throw errorTypes_1.E_ERROR.PRODUCT_OR_VENDOR_NOT_FOUND;
    }
    catch (error) {
        console.log(error);
        return new errorHandler_1.Errors(error);
    }
};
exports.updateStockService = updateStockService;
const getStockTokoService = async () => {
    try {
        const stocks = await stock_1.Stock.find({ relations: ['product', 'product.vendor'] });
        const filteredStockToko = stocks.filter(stock => stock.stock_toko > 0).map(item => {
            return {
                ...item,
                gudang: false
            };
        });
        const filteredStockGudang = stocks.filter(stock => stock.stock_gudang > 0)
            .map(item => {
            return {
                ...item,
                gudang: true
            };
        });
        const mergeStock = [...filteredStockToko, ...filteredStockGudang];
        return mergeStock;
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.getStockTokoService = getStockTokoService;
const removeStockService = async ({ id }) => {
    try {
        const _deletedStock = await stock_1.Stock.findOne({ where: { id } });
        if (_deletedStock == null)
            return { message: 'Stock is not found!' };
        await _deletedStock.remove();
        return { message: 'Stock is deleted!' };
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
};
exports.removeStockService = removeStockService;
