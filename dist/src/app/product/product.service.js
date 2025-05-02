"use strict";
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
const getAllProductsService = async () => {
    try {
        const products = await product_1.Product.find({
            relations: ['stocks', 'vendor'],
            order: { created_at: 'DESC' }
        });
        return response_1.default.success({ data: products, stat_msg: 'SUCCESS' });
    }
    catch (e) {
        throw new errorHandler_1.Errors(e);
    }
};
exports.getAllProductsService = getAllProductsService;
const createProductService = async (payload) => {
    const queryRunner = app_1.db.queryRunner();
    try {
        await queryRunner.startTransaction();
        const new_products = await Promise.all(payload.map(async (product) => {
            const vendor = await vendor_1.Vendor.findOne({ where: { id: product.vendorId } });
            if (vendor == null)
                throw errorTypes_1.E_ERROR.VENDOR_NOT_FOUND;
            const stocks = product?.stok?.map(item => {
                const newStock = new stock_1.Stock();
                newStock.buy_price = product.hargaModal ?? 0;
                newStock.sell_price = product.hargaJual ?? 0;
                newStock.weight = item.berat;
                return newStock;
            });
            const insertedStocks = await queryRunner.manager.save(stocks);
            const stockGudang = await Promise.all(insertedStocks.map(async (stock, index) => {
                const newStockGudang = new stockGudang_1.StockGudang();
                newStockGudang.amount = product.stok ? product.stok[index].jumlahBox : 0;
                newStockGudang.code = StocksCode_1.E_GUDANG_CODE_KEY.GUD_ADD_BRG_MASUK;
                newStockGudang.stock_id = stock.id;
                stock.stock_gudang += product.stok ? product.stok[index].jumlahBox : 0;
                await queryRunner.manager.save(stock);
                return newStockGudang;
            }));
            const newProduct = new product_1.Product();
            newProduct.sku = product.sku;
            newProduct.name = product.name;
            newProduct.arrival_date = product.tanggalMasuk;
            newProduct.stocks = stocks ?? [];
            newProduct.vendorId = product.vendorId;
            await queryRunner.manager.save(stockGudang);
            return newProduct;
        }));
        await queryRunner.manager.save(new_products);
        await queryRunner.commitTransaction();
        return new_products;
    }
    catch (e) {
        await queryRunner.rollbackTransaction();
        return await Promise.reject(new errorHandler_1.Errors(e));
    }
    finally {
        await queryRunner.release();
    }
};
exports.createProductService = createProductService;
const searchProductService = async ({ query }) => {
    try {
        const products = await product_1.Product.createQueryBuilder('product')
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
};
exports.searchProductService = searchProductService;
const updateProductService = async (id, payload) => {
    try {
        const _updatedProduct = await product_1.Product.findOne({ where: { id } });
        if (_updatedProduct == null) {
            throw errorTypes_1.E_ERROR.PRODUCT_NOT_FOUND;
        }
        _updatedProduct.name = payload.name;
        _updatedProduct.arrival_date = payload.tanggalMasuk;
        _updatedProduct.vendorId = payload.vendorId;
        const _updatedStock = await stock_1.Stock.find({ where: { productId: id } });
        if (_updatedStock == null) {
            throw errorTypes_1.E_ERROR.STOCK_NOT_FOUND;
        }
        await Promise.all(_updatedStock.map(async (it) => {
            it.buy_price = payload.hargaModal;
            it.sell_price = payload.hargaJual;
            await it.save();
        }));
        await _updatedProduct.save();
        return await product_1.Product.findOne({ where: { id } });
    }
    catch (e) {
        throw new errorHandler_1.Errors(e);
    }
};
exports.updateProductService = updateProductService;
const deleteProductService = async ({ id }) => {
    try {
        const _deletedProduct = await product_1.Product.findOne({
            where: { id }, withDeleted: true, relations: ['stocks']
        });
        if (_deletedProduct == null)
            throw errorTypes_1.E_ERROR.PRODUCT_NOT_FOUND;
        await Promise.all(_deletedProduct.stocks.map(async (item) => {
            await item.softRemove();
        }));
        await _deletedProduct.softRemove();
        return { message: 'Product is deleted!' };
    }
    catch (e) {
        throw new errorHandler_1.Errors(e);
    }
};
exports.deleteProductService = deleteProductService;
const addMixedProductService = async (payload) => {
    const queryRunner = app_1.db.queryRunner();
    try {
        await queryRunner.startTransaction();
        const sumStock = payload.stock.reduce((prev, next) => prev + next.amount, 0);
        const stock_all = [];
        const stocks = await Promise.all(payload.stock.map(async (item) => {
            const stock = await stock_1.Stock.findOne({ where: { id: item.stock_id } });
            if (stock) {
                const stock_toko = new stockToko_1.StockToko();
                stock_toko.stock_id = item.stock_id;
                stock_toko.amount = item.stock_id === payload.selectedStockID ? sumStock : item.amount;
                stock_toko.code = item.stock_id === payload.selectedStockID ? StocksCode_1.E_TOKO_CODE_KEY.TOK_ADD_MIX : StocksCode_1.E_TOKO_CODE_KEY.TOK_SUB_MIX;
                stock.stock_toko = item.stock_id === payload.selectedStockID
                    ? sumStock
                    : stock.stock_toko - item.amount;
                stock_all.push(stock);
                return stock_toko;
            }
        }));
        await queryRunner.manager.save(stocks);
        await queryRunner.manager.save(stock_all);
        await queryRunner.commitTransaction();
        return stocks;
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        await queryRunner.release();
    }
};
exports.addMixedProductService = addMixedProductService;
