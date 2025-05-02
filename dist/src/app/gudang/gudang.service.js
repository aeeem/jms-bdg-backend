"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tambahStockGudangService = exports.pindahStockGudangService = exports.getStockGudangService = void 0;
const product_1 = require("@entity/product");
const stock_1 = require("@entity/stock");
const stockGudang_1 = require("@entity/stockGudang");
const stockToko_1 = require("@entity/stockToko");
const app_1 = require("src/app");
const errorTypes_1 = require("src/constants/errorTypes");
const errorHandler_1 = require("src/errorHandler");
const StocksCode_1 = require("src/interface/StocksCode");
const getStockGudangService = async () => {
    try {
        const stocks = await stockGudang_1.StockGudang.find({
            relations: [
                'stock',
                'stock.product',
                'stock.product.vendor'
            ]
        });
        return stocks;
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.getStockGudangService = getStockGudangService;
const pindahStockGudangService = async (payload) => {
    const queryRunner = app_1.db.queryRunner();
    try {
        await queryRunner.startTransaction();
        const stocks_gudang = payload.map(item => {
            const stock = new stockGudang_1.StockGudang();
            stock.amount = item.amount;
            stock.stock_id = item.stock_id;
            stock.code = StocksCode_1.E_GUDANG_CODE_KEY.GUD_SUB_BRG_PIN_TOKO;
            return stock;
        });
        const stocks_toko = await Promise.all(payload.map(async (item) => {
            const stock = await stock_1.Stock.findOneOrFail(item.stock_id);
            const item_toko = new stockToko_1.StockToko();
            item_toko.code = StocksCode_1.E_TOKO_CODE_KEY.TOK_ADD_BRG_MASUK;
            item_toko.stock_id = item.stock_id;
            item_toko.amount = stock?.weight * item.amount;
            return item_toko;
        }));
        // const updateStockGudangOnStockTable = await Promise.all( payload.map( async stock => {
        //   // append dari stock gudang yg di database, dan yang baru di add dari payload
        //   const stockGudang = [...await StockGudang.find( { where: { stock_id: stock.stock_id } } ), ...stocks_gudang]
        //   const stockData = await Stock.findOneOrFail( stock.stock_id )
        //   stockData.stock_gudang = CalculateTotalStock( stockGudang )
        //   return stockData
        // } ) )
        const updateStockValue = await Promise.all(payload.map(async (item) => {
            const stockData = await stock_1.Stock.findOneOrFail(item.stock_id);
            const amountStock = item.amount * stockData.weight;
            const currentStockToko = stockData.stock_toko;
            const resultStockToko = Number(currentStockToko ?? 0) + amountStock;
            stockData.stock_gudang -= item.amount;
            stockData.stock_toko = resultStockToko;
            return stockData;
        }));
        const hasMinusStock = updateStockValue.some(stock => stock.stock_gudang < 0);
        if (hasMinusStock)
            throw errorTypes_1.E_ERROR.INSUFFICIENT_STOCK_GDG;
        await queryRunner.manager.save(stocks_gudang);
        await queryRunner.manager.save(stocks_toko);
        await queryRunner.manager.save(updateStockValue);
        await queryRunner.commitTransaction();
        return stocks_gudang;
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        await Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        await queryRunner.release();
    }
};
exports.pindahStockGudangService = pindahStockGudangService;
const tambahStockGudangService = async (payload) => {
    const queryRunner = app_1.db.queryRunner();
    try {
        await queryRunner.startTransaction();
        const isProductExists = await product_1.Product.find({ where: [{ id: payload.product_id }, { vendorId: payload.vendor_id }] });
        if (!isProductExists.length)
            throw errorTypes_1.E_ERROR.PRODUCT_NOT_FOUND_ONDB;
        const stock = new stock_1.Stock();
        stock.buy_price = payload.buy_price;
        stock.sell_price = payload.sell_price;
        stock.stock_gudang = payload.box_amount;
        const stockGudangs = [];
        for (let brg = 0; brg < payload.box_amount; brg++) {
            const stockGudang = new stockGudang_1.StockGudang();
            stockGudang.amount = 1;
            stockGudang.code = StocksCode_1.E_GUDANG_CODE_KEY.GUD_ADD_BRG_MASUK;
            stockGudang.stock_id = stock.id;
            stockGudangs.push(stockGudang);
        }
        await queryRunner.manager.save(stock);
        await queryRunner.manager.save(stockGudangs);
        await queryRunner.commitTransaction();
        return stock;
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        await queryRunner.release();
    }
};
exports.tambahStockGudangService = tambahStockGudangService;
