"use strict";
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
const getDeductedStock = (stock, isPendingUpdate, existStock) => {
    if (isPendingUpdate) {
        return Number(stock) + Number(existStock ?? 0);
    }
    return Number(stock);
};
const stockDeductor = async (stock_id, amount, is_gudang, isPendingUpdate, existStock) => {
    const stock = await stock_1.Stock.findOneOrFail(stock_id);
    if (is_gudang && getDeductedStock(stock.stock_gudang, isPendingUpdate, existStock) - amount < 0) {
        throw errorTypes_1.E_ERROR.INSUFFICIENT_STOCK;
    }
    if (is_gudang) {
        const stock_gudang = new stockGudang_1.StockGudang();
        stock_gudang.amount = amount;
        stock_gudang.code = StocksCode_1.E_GUDANG_CODE_KEY.GUD_SUB_BRG_TRANSAKSI;
        stock_gudang.stock_id = stock_id;
        stock.stock_gudang = getDeductedStock(stock.stock_gudang, isPendingUpdate, existStock) - amount;
        return {
            entity: stock_gudang,
            stock
        };
    }
    if (getDeductedStock(stock.stock_toko, isPendingUpdate, existStock) - Number(amount) < 0) {
        throw errorTypes_1.E_ERROR.INSUFFICIENT_STOCK;
    }
    stock.stock_toko = getDeductedStock(stock.stock_toko, isPendingUpdate, existStock) - amount;
    // Add deduction record into stock_toko
    const stock_toko = new stockToko_1.StockToko();
    stock_toko.amount = amount;
    stock_toko.code = StocksCode_1.E_TOKO_CODE_KEY.TOK_SUB_TRANSAKSI;
    stock_toko.stock_id = stock_id;
    return {
        entity: stock_toko,
        stock
    };
};
exports.stockDeductor = stockDeductor;
const parseSKU = (skuStockId) => {
    const [sku, stockId] = skuStockId.split('@');
    return {
        sku,
        stockId
    };
};
exports.parseSKU = parseSKU;
