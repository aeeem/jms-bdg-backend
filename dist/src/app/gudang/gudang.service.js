"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const getStockGudangService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stocks = yield stockGudang_1.StockGudang.find({
            relations: [
                'stock',
                'stock.product',
                'stock.product.vendor'
            ]
        });
        return stocks;
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.getStockGudangService = getStockGudangService;
const pindahStockGudangService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = app_1.db.queryRunner();
    try {
        yield queryRunner.startTransaction();
        const stocks_gudang = payload.stock_ids.map(stock_id => {
            const item_gudang = new stockGudang_1.StockGudang();
            item_gudang.amount = 1;
            item_gudang.code = StocksCode_1.E_GUDANG_CODE_KEY.GUD_SUB_BRG_PIN_TOKO;
            item_gudang.stock_id = stock_id;
            return item_gudang;
        });
        const stocks_toko = payload.stock_ids.map(stock_id => {
            const item_toko = new stockToko_1.StockToko();
            item_toko.amount = 1;
            item_toko.code = StocksCode_1.E_TOKO_CODE_KEY.TOK_ADD_BRG_MASUK;
            item_toko.stock_id = stock_id;
            return item_toko;
        });
        yield queryRunner.manager.save(stocks_gudang);
        yield queryRunner.manager.save(stocks_toko);
        yield queryRunner.commitTransaction();
        return stocks_gudang;
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        yield queryRunner.release();
    }
});
exports.pindahStockGudangService = pindahStockGudangService;
const tambahStockGudangService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = app_1.db.queryRunner();
    try {
        yield queryRunner.startTransaction();
        const isProductExists = yield product_1.Product.find({ where: [{ id: payload.product_id }, { vendorId: payload.vendor_id }] });
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
        yield queryRunner.manager.save(stock);
        yield queryRunner.manager.save(stockGudangs);
        yield queryRunner.commitTransaction();
        return stock;
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        yield queryRunner.release();
    }
});
exports.tambahStockGudangService = tambahStockGudangService;
