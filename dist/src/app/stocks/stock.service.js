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
exports.removeStockService = exports.updateStockService = exports.updateExistingStockService = exports.findStockService = exports.addStockService = exports.getAllStocksService = void 0;
const stock_1 = require("@entity/stock");
const lodash_1 = __importDefault(require("lodash"));
const product_1 = require("@entity/product");
const vendor_1 = require("@entity/vendor");
const enums_1 = require("src/errorHandler/enums");
const getAllStocksService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield stock_1.Stock.find({
            relations: ["vendor", "product"]
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllStocksService = getAllStocksService;
const addStockService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _newStock = new stock_1.Stock();
        yield _newStock.save();
        return yield stock_1.Stock.findOne({
            where: { id: _newStock.id }
        });
    }
    catch (error) {
        console.error(error);
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
            return { message: "Stock is not found!" };
        return stock;
    }
    catch (error) {
        console.error(error);
    }
});
exports.findStockService = findStockService;
const updateExistingStockService = ({ id, body }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stock = yield stock_1.Stock.findOneOrFail({ where: { id: id } });
        stock['buy_price'] = body.buy_price;
        stock['total_stock'] = body.total_stock;
        yield stock.save();
        return yield stock_1.Stock.findOne({
            where: { id }
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.updateExistingStockService = updateExistingStockService;
const updateStockService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_1.Product.findOne({ where: { id: body.productId } });
        const vendor = yield vendor_1.Vendor.findOne({ where: { id: body.vendorId } });
        if (!product || !vendor)
            throw enums_1.E_ErrorType.E_PRODUCT_OR_VENDOR_NOT_FOUND;
        const existingStock = yield stock_1.Stock.findOne({
            where: {
                product,
                vendor
            }
        });
        if (existingStock) {
            existingStock['buy_price'] = body.buy_price;
            existingStock['total_stock'] = body.total_stock;
            yield existingStock.save();
            return yield stock_1.Stock.findOne({
                where: { id: existingStock.id }
            });
        }
        else {
            const _newStock = new stock_1.Stock();
            _newStock['buy_price'] = body.buy_price;
            _newStock['total_stock'] = body.total_stock;
            _newStock.product = product;
            _newStock.vendor = vendor;
            yield _newStock.save();
            return yield stock_1.Stock.findOne({
                where: { id: _newStock.id }
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.updateStockService = updateStockService;
const removeStockService = ({ id }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _deletedStock = yield stock_1.Stock.findOne({ where: { id } });
        if (!_deletedStock)
            return { message: "Stock is not found!" };
        yield _deletedStock.remove();
        return { message: "Stock is deleted!" };
    }
    catch (error) {
        console.error(error);
    }
});
exports.removeStockService = removeStockService;
