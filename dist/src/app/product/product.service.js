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
exports.addMixedProductService = exports.deleteProductService = exports.updateProductService = exports.searchProductService = exports.createProductService = exports.getAllProductsService = void 0;
const product_1 = require("@entity/product");
const stock_1 = require("@entity/stock");
const stockToko_1 = require("@entity/stockToko");
const stockGudang_1 = require("@entity/stockGudang");
const vendor_1 = require("@entity/vendor");
const app_1 = require("src/app");
const errorTypes_1 = require("src/constants/errorTypes");
const response_1 = __importDefault(require("src/helper/response"));
const StocksCode_1 = require("src/interface/StocksCode");
const errorHandler_1 = require("../../errorHandler");
const getAllProductsService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.Product.find({
            relations: ['stocks', 'vendor'],
            order: { created_at: 'DESC' }
        });
        return response_1.default.success({ data: products, stat_msg: 'SUCCESS' });
    }
    catch (e) {
        throw new errorHandler_1.Errors(e);
    }
});
exports.getAllProductsService = getAllProductsService;
const createProductService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = app_1.db.queryRunner();
    try {
        yield queryRunner.startTransaction();
        const new_products = yield Promise.all(payload.map((product) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const vendor = yield vendor_1.Vendor.findOne({ where: { id: product.vendorId } });
            if (vendor == null)
                throw errorTypes_1.E_ERROR.VENDOR_NOT_FOUND;
            const stocks = (_a = product === null || product === void 0 ? void 0 : product.stok) === null || _a === void 0 ? void 0 : _a.map(item => {
                var _a, _b;
                const newStock = new stock_1.Stock();
                newStock.buy_price = (_a = product.hargaModal) !== null && _a !== void 0 ? _a : 0;
                newStock.sell_price = (_b = product.hargaJual) !== null && _b !== void 0 ? _b : 0;
                newStock.weight = item.berat;
                return newStock;
            });
            const insertedStocks = yield queryRunner.manager.save(stocks);
            const stockGudang = yield Promise.all(insertedStocks.map((stock, index) => __awaiter(void 0, void 0, void 0, function* () {
                const newStockGudang = new stockGudang_1.StockGudang();
                newStockGudang.amount = product.stok ? product.stok[index].jumlahBox : 0;
                newStockGudang.code = StocksCode_1.E_GUDANG_CODE_KEY.GUD_ADD_BRG_MASUK;
                newStockGudang.stock_id = stock.id;
                stock.stock_gudang += product.stok ? product.stok[index].jumlahBox : 0;
                yield queryRunner.manager.save(stock);
                return newStockGudang;
            })));
            const newProduct = new product_1.Product();
            newProduct.sku = product.sku;
            newProduct.name = product.name;
            newProduct.arrival_date = product.tanggalMasuk;
            newProduct.stocks = stocks !== null && stocks !== void 0 ? stocks : [];
            newProduct.vendorId = product.vendorId;
            yield queryRunner.manager.save(stockGudang);
            return newProduct;
        })));
        yield queryRunner.manager.save(new_products);
        yield queryRunner.commitTransaction();
        return new_products;
    }
    catch (e) {
        yield queryRunner.rollbackTransaction();
        return yield Promise.reject(new errorHandler_1.Errors(e));
    }
    finally {
        yield queryRunner.release();
    }
});
exports.createProductService = createProductService;
const searchProductService = ({ query }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.Product.createQueryBuilder('product')
            .where('LOWER(product.sku) LIKE :query OR LOWER(product.name) LIKE :name', { query: `%${query}%`, name: `%${query}%` })
            .leftJoinAndSelect('product.stocks', 'stocks')
            .leftJoinAndSelect('product.vendor', 'vendor')
            .orderBy('product.id', 'ASC')
            .getMany();
        return response_1.default.success({ data: products, stat_msg: 'SUCCESS' });
    }
    catch (e) {
        throw new errorHandler_1.Errors(e);
    }
});
exports.searchProductService = searchProductService;
const updateProductService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _updatedProduct = yield product_1.Product.findOne({ where: { id } });
        if (_updatedProduct == null) {
            throw errorTypes_1.E_ERROR.PRODUCT_NOT_FOUND;
        }
        _updatedProduct.name = payload.name;
        _updatedProduct.arrival_date = payload.tanggalMasuk;
        _updatedProduct.vendorId = payload.vendorId;
        const _updatedStock = yield stock_1.Stock.find({ where: { productId: id } });
        if (_updatedStock == null) {
            throw errorTypes_1.E_ERROR.STOCK_NOT_FOUND;
        }
        yield Promise.all(_updatedStock.map((it) => __awaiter(void 0, void 0, void 0, function* () {
            it.buy_price = payload.hargaModal;
            it.sell_price = payload.hargaJual;
            yield it.save();
        })));
        yield _updatedProduct.save();
        return yield product_1.Product.findOne({ where: { id } });
    }
    catch (e) {
        throw new errorHandler_1.Errors(e);
    }
});
exports.updateProductService = updateProductService;
const deleteProductService = ({ id }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _deletedProduct = yield product_1.Product.findOne({
            where: { id }, withDeleted: true, relations: ['stocks']
        });
        if (_deletedProduct == null)
            throw errorTypes_1.E_ERROR.PRODUCT_NOT_FOUND;
        yield Promise.all(_deletedProduct.stocks.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield item.softRemove();
        })));
        yield _deletedProduct.softRemove();
        return { message: 'Product is deleted!' };
    }
    catch (e) {
        throw new errorHandler_1.Errors(e);
    }
});
exports.deleteProductService = deleteProductService;
const addMixedProductService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = app_1.db.queryRunner();
    try {
        yield queryRunner.startTransaction();
        const sumStock = payload.stock.reduce((prev, next) => prev + next.amount, 0);
        const stocks = yield Promise.all(payload.stock.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const isProductExist = yield stock_1.Stock.findOne({ where: { id: item.stock_id } });
            if (isProductExist) {
                const stock_toko = new stockToko_1.StockToko();
                stock_toko.stock_id = item.stock_id;
                stock_toko.amount = item.stock_id === payload.selectedStockID ? sumStock : item.amount;
                stock_toko.code = item.stock_id === payload.selectedStockID ? StocksCode_1.E_TOKO_CODE_KEY.TOK_ADD_MIX : StocksCode_1.E_TOKO_CODE_KEY.TOK_SUB_MIX;
                return stock_toko;
            }
        })));
        yield queryRunner.manager.save(stocks);
        yield queryRunner.commitTransaction();
        return stocks;
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        yield queryRunner.release();
    }
});
exports.addMixedProductService = addMixedProductService;
