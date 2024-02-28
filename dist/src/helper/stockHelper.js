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
exports.parseSKU = exports.stockDeductor = exports.CalculateTotalStock = exports.isSubtraction = void 0;
const stock_1 = require("@entity/stock");
const stockGudang_1 = require("@entity/stockGudang");
const stockToko_1 = require("@entity/stockToko");
const errorTypes_1 = require("src/constants/errorTypes");
const StocksCode_1 = require("src/interface/StocksCode");
const isAddition = (source) => {
    return source.includes('_ADD_');
};
const isSubtraction = (source) => {
    return source.includes('_SUB_');
};
exports.isSubtraction = isSubtraction;
const CalculateTotalStock = (stock) => {
    const total = stock.reduce((acc, cur) => {
        if (isAddition(cur.code))
            return acc + cur.amount;
        return acc - cur.amount;
    }, 0);
    return total;
};
exports.CalculateTotalStock = CalculateTotalStock;
const stockDeductor = (stock_id, amount, is_gudang) => __awaiter(void 0, void 0, void 0, function* () {
    const stock = yield stock_1.Stock.findOneOrFail(stock_id);
    if (is_gudang && stock.stock_gudang - amount < 0)
        throw errorTypes_1.E_ERROR.INSUFFICIENT_STOCK;
    if (is_gudang) {
        const stock_gudang = new stockGudang_1.StockGudang();
        stock_gudang.amount = amount;
        stock_gudang.code = StocksCode_1.E_GUDANG_CODE_KEY.GUD_SUB_BRG_TRANSAKSI;
        stock_gudang.stock_id = stock_id;
        stock.stock_gudang -= amount;
        return {
            entity: stock_gudang,
            stock
        };
    }
    if (stock.stock_toko - amount < 0)
        throw errorTypes_1.E_ERROR.INSUFFICIENT_STOCK;
    stock.stock_toko -= amount;
    // Add deduction record into stock_toko
    const stock_toko = new stockToko_1.StockToko();
    stock_toko.amount = amount;
    stock_toko.code = StocksCode_1.E_TOKO_CODE_KEY.TOK_SUB_TRANSAKSI;
    stock_toko.stock_id = stock_id;
    return {
        entity: stock_toko,
        stock
    };
});
exports.stockDeductor = stockDeductor;
const parseSKU = (skuStockId) => {
    const [sku, stockId] = skuStockId.split('@');
    return {
        sku,
        stockId
    };
};
exports.parseSKU = parseSKU;
