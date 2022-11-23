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
exports.deleteProductService = exports.updateProductService = exports.searchProductService = exports.createProductService = exports.getAllProductsService = void 0;
const product_1 = require("@entity/product");
const stock_1 = require("@entity/stock");
const vendor_1 = require("@entity/vendor");
const errorTypes_1 = require("src/constants/errorTypes");
const response_1 = __importDefault(require("src/helper/response"));
const errorHandler_1 = require("../../errorHandler");
const getAllProductsService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.Product.find({ relations: ['stocks', 'vendor'] });
        return response_1.default.success({ data: products, stat_msg: 'SUCCESS' });
    }
    catch (e) {
        throw new errorHandler_1.Errors(e);
    }
});
exports.getAllProductsService = getAllProductsService;
const createProductService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const new_products = yield Promise.all(payload.map((product) => __awaiter(void 0, void 0, void 0, function* () {
            const vendor = yield vendor_1.Vendor.findOne({ where: { id: product.vendorId } });
            if (vendor == null)
                throw errorTypes_1.E_ERROR.NOT_FOUND;
            const stock = new stock_1.Stock();
            stock.buy_price = product.hargaModal;
            stock.sell_price = product.hargaJual;
            stock.stock_gudang = product.stok;
            const newProduct = new product_1.Product();
            newProduct.sku = product.sku;
            newProduct.name = product.name;
            newProduct.arrival_date = product.tanggalMasuk;
            newProduct.stocks = [stock];
            return newProduct;
        })));
        yield product_1.Product.save(new_products);
        return new_products;
    }
    catch (e) {
        throw new errorHandler_1.Errors(e);
    }
});
exports.createProductService = createProductService;
const searchProductService = ({ query }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.Product.createQueryBuilder('product')
            .where('product.sku LIKE :query OR product.name LIKE :query', { query: `%${query}%` })
            .leftJoinAndSelect('product.stock', 'stock')
            .leftJoinAndSelect('stock.vendor', 'vendor')
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
        const _updatedStock = yield stock_1.Stock.findOne({ where: { productId: id } });
        if (_updatedStock == null) {
            throw errorTypes_1.E_ERROR.STOCK_NOT_FOUND;
        }
        _updatedStock.buy_price = payload.hargaModal;
        _updatedStock.sell_price = payload.hargaJual;
        _updatedStock.stock_toko = payload.stok;
        if (_updatedProduct == null) {
            throw errorTypes_1.E_ERROR.PRODUCT_NOT_FOUND;
        }
        _updatedProduct.name = payload.name;
        _updatedProduct.sku = payload.sku;
        _updatedProduct.arrival_date = payload.tanggalMasuk;
        _updatedProduct.stocks = [_updatedStock];
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
        const _deletedProduct = yield product_1.Product.findOne({ where: { id } });
        if (_deletedProduct == null)
            throw errorTypes_1.E_ERROR.PRODUCT_NOT_FOUND;
        yield _deletedProduct.remove();
        return { message: 'Product is deleted!' };
    }
    catch (e) {
        throw new errorHandler_1.Errors(e);
    }
});
exports.deleteProductService = deleteProductService;
