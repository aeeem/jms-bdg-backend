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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeStockService = exports.getStockTokoService = exports.updateStockService = exports.updateExistingStockService = exports.findStockService = exports.addStockService = exports.getAllStocksService = void 0;
const stock_1 = require("@entity/stock");
const lodash_1 = __importDefault(require("lodash"));
const response_1 = __importDefault(require("src/helper/response"));
const errorTypes_1 = require("src/constants/errorTypes");
const errorHandler_1 = require("src/errorHandler");
const stockToko_1 = require("@entity/stockToko");
const getAllStocksService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield stock_1.Stock.find({ relations: ['vendor', 'product'] });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
});
exports.getAllStocksService = getAllStocksService;
const addStockService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _newStock = new stock_1.Stock();
        yield _newStock.save();
        return yield stock_1.Stock.findOne({ where: { id: _newStock.id } });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
});
exports.addStockService = addStockService;
const findStockService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stock = yield stock_1.Stock.createQueryBuilder()
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
});
exports.findStockService = findStockService;
const updateExistingStockService = ({ id, body }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stock = yield stock_1.Stock.findOneOrFail({ where: { id } });
        stock.buy_price = body.buy_price ? body.buy_price : stock.buy_price;
        stock.stock_gudang = body.total_stock ? body.total_stock : stock.stock_gudang;
        yield stock.save();
        return yield stock_1.Stock.findOne({ where: { id } });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
});
exports.updateExistingStockService = updateExistingStockService;
const updateStockService = (body, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingStock = yield stock_1.Stock.findOne({ where: { id } });
        if (existingStock != null) {
            existingStock.productId = body.productId ? body.productId : existingStock.productId;
            existingStock.buy_price = body.buy_price ? body.buy_price : existingStock.buy_price;
            existingStock.stock_gudang = body.total_stock ? body.total_stock : existingStock.stock_gudang;
            existingStock.sell_price = body.sell_price ? body.sell_price : existingStock.sell_price;
            yield existingStock.save();
            const stock = yield stock_1.Stock.findOne({ where: { id: existingStock.id } });
            if (stock != null) {
                return response_1.default.success({
                    data: stock, stat_code: 200, stat_msg: 'Stock updated successfully!'
                });
            }
        }
        throw errorTypes_1.E_ERROR.PRODUCT_OR_VENDOR_NOT_FOUND;
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
});
exports.updateStockService = updateStockService;
const getStockTokoService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stocks = yield stockToko_1.StockToko.find({
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
exports.getStockTokoService = getStockTokoService;
const removeStockService = ({ id }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _deletedStock = yield stock_1.Stock.findOne({ where: { id } });
        if (_deletedStock == null)
            return { message: 'Stock is not found!' };
        yield _deletedStock.remove();
        return { message: 'Stock is deleted!' };
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
});
exports.removeStockService = removeStockService;
