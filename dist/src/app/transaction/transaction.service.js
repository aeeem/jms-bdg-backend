"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteTransactionService = exports.getTransactionByIdService = exports.updateTransactionService = exports.searchTransactionService = exports.deletePendingTransactionItemService = exports.deletePendingTransactionService = exports.updatePendingTransactionService = exports.createTransactionService = exports.getAllTransactionService = void 0;
const Sentry = __importStar(require("@sentry/node"));
const cashFlow_1 = require("@entity/cashFlow");
const customer_1 = require("@entity/customer");
const customerMonetary_1 = require("@entity/customerMonetary");
const stock_1 = require("@entity/stock");
const stockToko_1 = require("@entity/stockToko");
const transaction_1 = require("@entity/transaction");
const transactionDetail_1 = require("@entity/transactionDetail");
const lodash_1 = __importDefault(require("lodash"));
const app_1 = require("src/app");
const errorTypes_1 = require("src/constants/errorTypes");
const languageEnums_1 = require("src/constants/languageEnums");
const cashFlow_2 = require("src/database/enum/cashFlow");
const hutangPiutang_1 = require("src/database/enum/hutangPiutang");
const transaction_2 = require("src/database/enum/transaction");
const errorHandler_1 = require("src/errorHandler");
const stockHelper_1 = require("src/helper/stockHelper");
const StocksCode_1 = require("src/interface/StocksCode");
const customer_service_1 = require("../customer/customer.service");
const transaction_helper_1 = require("./transaction.helper");
const getAllTransactionService = (sort = 'DESC') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = sort;
        const transactions = yield transaction_1.Transaction.find({
            withDeleted: true,
            order: { updated_at: order },
            where: { status: transaction_2.E_TransactionStatus.FINISHED },
            relations: [
                'customer',
                'cashier',
                'transactionDetails',
                'transactionDetails.stock',
                'transactionDetails.stock.product',
                'transactionDetails.stock.product.vendor'
            ]
        });
        return (0, transaction_helper_1.formatTransaction)(transactions);
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.getAllTransactionService = getAllTransactionService;
const createTransactionService = (payload, isPending = false, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const queryRunner = app_1.db.queryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        const customer = yield queryRunner.manager.findOne(customer_1.Customer, { where: { id: payload.customer_id } });
        const customerDeposit = customer ? (yield (0, customer_service_1.getCustomerDepositService)(customer.id)).total_deposit : 0;
        // getCustomerDebtService with condition is_pay_debt
        const stocks = yield queryRunner.manager.find(stock_1.Stock, { relations: ['product', 'product.vendor'] });
        const expected_total_price = 0;
        const transactionDetails = payload.detail.map(transactionDetail => {
            const stock = stocks.find(product => product.id === transactionDetail.stock_id);
            if (stock == null)
                throw errorTypes_1.E_ERROR.PRODUCT_NOT_FOUND;
            const detail = new transactionDetail_1.TransactionDetail();
            detail.amount = transactionDetail.amount;
            detail.sub_total = transactionDetail.sub_total;
            detail.stock_id = transactionDetail.stock_id;
            detail.stock = stock;
            detail.is_box = transactionDetail.box;
            return detail;
        });
        const stockSync = yield Promise.all(payload.detail.map((detail) => __awaiter(void 0, void 0, void 0, function* () {
            const stockHelper = yield (0, stockHelper_1.stockDeductor)(detail.stock_id, detail.amount, detail.box);
            yield queryRunner.manager.save(stockHelper.entity);
            return stockHelper.stock;
        })));
        // passing customer debt here
        const transactionProcess = new transaction_helper_1.TransactionProcessor(payload, customer, transactionDetails, expected_total_price, customerDeposit, isPending, payload.pay_debt, queryRunner, user);
        yield transactionProcess.start();
        if (payload.amount_paid) {
            const cashFlow = new cashFlow_1.CashFlow();
            cashFlow.amount = payload.amount_paid < payload.actual_total_price ? payload.amount_paid : payload.actual_total_price;
            cashFlow.code = cashFlow_2.E_CashFlowCode.IN_TRANSACTION;
            cashFlow.transaction_id = transactionProcess.transaction.id;
            cashFlow.type = cashFlow_2.E_CashFlowType.CashIn;
            cashFlow.cash_type = payload.is_transfer ? cashFlow_2.E_CashType.TRANSFER : cashFlow_2.E_CashType.CASH;
            if (payload.customer_id) {
                cashFlow.customer_id = payload.customer_id;
            }
            cashFlow.note = 'Penjualan produk' + `${payload.pay_debt ? ' & Bayar Kasbon' : ''}`; // temporary harcode
            yield queryRunner.manager.save(cashFlow);
        }
        yield queryRunner.manager.save(stockSync);
        yield queryRunner.commitTransaction();
        return {
            transaction: (0, transaction_helper_1.formatTransaction)([transactionProcess.transaction]),
            customer: Object.assign(Object.assign({}, transactionProcess.transaction.customer), { deposit_balance: transactionProcess.transaction.customer ? (yield (0, customer_service_1.getCustomerDepositService)((_b = (_a = transactionProcess.transaction) === null || _a === void 0 ? void 0 : _a.customer) === null || _b === void 0 ? void 0 : _b.id)).total_deposit : 0, debt_balance: transactionProcess.transaction.customer ? (yield (0, customer_service_1.getCustomerDebtService)((_d = (_c = transactionProcess.transaction) === null || _c === void 0 ? void 0 : _c.customer) === null || _d === void 0 ? void 0 : _d.id)).total_debt : 0 })
        };
    }
    catch (error) {
        Sentry.captureException(error);
        yield queryRunner.rollbackTransaction();
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        yield queryRunner.release();
    }
});
exports.createTransactionService = createTransactionService;
const updatePendingTransactionService = (transaction_id, items) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = app_1.db.queryRunner();
    try {
        yield queryRunner.startTransaction();
        const transaction = yield transaction_1.Transaction.findOne({ where: { id: transaction_id }, relations: ['transactionDetails', 'transactionDetails.stock'] });
        if (!transaction)
            throw errorTypes_1.E_ERROR.TRANSACTION_NOT_FOUND;
        const transactionDetailsIds = transaction.transactionDetails.map(detail => detail.stock_id);
        const payloadStockIds = items.map(item => item.stock_id);
        const updateData = yield Promise.all(transaction.transactionDetails.filter(detail => payloadStockIds.includes(detail.stock_id)).map((transactionDetail) => __awaiter(void 0, void 0, void 0, function* () {
            const masterStock = yield stock_1.Stock.findOneOrFail(transactionDetail.stock_id);
            const payload = items.find(item => item.stock_id === transactionDetail.stock_id);
            const stockToko = new stockToko_1.StockToko();
            if (!payload)
                throw errorTypes_1.E_ERROR.STOCK_NOT_FOUND;
            if (payload.amount === transactionDetail.amount)
                return transactionDetail;
            if (payload.amount > transactionDetail.amount) {
                masterStock.stock_toko -= payload.amount - transactionDetail.amount;
                stockToko.amount = payload.amount - transactionDetail.amount;
                stockToko.code = StocksCode_1.E_TOKO_CODE_KEY.TOK_SUB_BRG_PENDING_TRANSAKSI;
            }
            if (payload.amount < transactionDetail.amount) {
                masterStock.stock_toko += transactionDetail.amount - payload.amount;
                stockToko.amount = transactionDetail.amount - payload.amount;
                stockToko.code = StocksCode_1.E_TOKO_CODE_KEY.TOK_ADD_BRG_PENDING_TRANSAKSI;
            }
            transactionDetail.amount = payload.amount;
            transactionDetail.sub_total = payload.sub_total;
            stockToko.stock_id = payload.stock_id;
            yield queryRunner.manager.save(stockToko);
            yield queryRunner.manager.save(masterStock);
            return transactionDetail;
        })));
        const deleteData = yield Promise.all(transaction.transactionDetails.filter(detail => !payloadStockIds.includes(detail.stock_id)).map((transactionDetail) => __awaiter(void 0, void 0, void 0, function* () {
            const masterStock = yield stock_1.Stock.findOneOrFail(transactionDetail.stock_id);
            masterStock.stock_toko += transactionDetail.amount;
            const stockToko = new stockToko_1.StockToko();
            stockToko.amount = transactionDetail.amount;
            stockToko.code = StocksCode_1.E_TOKO_CODE_KEY.TOK_ADD_BRG_PENDING_TRANSAKSI;
            stockToko.stock_id = transactionDetail.stock_id;
            yield queryRunner.manager.save(stockToko);
            yield queryRunner.manager.save(masterStock);
            return transactionDetail;
        })));
        const insertData = yield Promise.all(items.filter(item => !transactionDetailsIds.includes(item.stock_id)).map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const transactionDetail = new transactionDetail_1.TransactionDetail();
            transactionDetail.amount = item.amount;
            transactionDetail.sub_total = item.sub_total;
            transactionDetail.stock_id = item.stock_id;
            const masterStock = yield stock_1.Stock.findOneOrFail(item.stock_id);
            masterStock.stock_toko -= item.amount;
            const stockToko = new stockToko_1.StockToko();
            stockToko.amount = item.amount;
            stockToko.code = StocksCode_1.E_TOKO_CODE_KEY.TOK_SUB_BRG_PENDING_TRANSAKSI;
            stockToko.stock_id = item.stock_id;
            yield queryRunner.manager.save(stockToko);
            yield queryRunner.manager.save(masterStock);
            return transactionDetail;
        })));
        yield queryRunner.manager.save(updateData);
        yield queryRunner.manager.remove(deleteData);
        yield queryRunner.manager.save(insertData);
        yield queryRunner.commitTransaction();
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        yield queryRunner.release();
    }
});
exports.updatePendingTransactionService = updatePendingTransactionService;
const deletePendingTransactionService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_1.Transaction.findOne(id);
    if (!transaction)
        throw errorTypes_1.E_ERROR.TRANSACTION_NOT_FOUND;
    const transactionItems = transaction.transactionDetails;
    if (transactionItems.length > 0) {
        yield (0, transaction_helper_1.restoreStocks)(transactionItems);
    }
    transaction.status = transaction_2.E_TransactionStatus.VOID;
    yield transaction.save();
    return transaction;
});
exports.deletePendingTransactionService = deletePendingTransactionService;
const deletePendingTransactionItemService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionItem = yield transactionDetail_1.TransactionDetail.findOne({
        where: {
            transaction_id: payload.transaction_id,
            stock_id: payload.stock_id
        }
    });
    if (!transactionItem)
        throw errorTypes_1.E_ERROR.STOCK_NOT_FOUND;
    yield (0, transaction_helper_1.restoreStocks)([transactionItem]);
    return transactionItem;
});
exports.deletePendingTransactionItemService = deletePendingTransactionItemService;
const searchTransactionService = (query, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield transaction_1.Transaction.createQueryBuilder('transaction')
            .where('transaction.transaction_id LIKE :query', { query: `%${id !== null && id !== void 0 ? id : ''}%` })
            .leftJoinAndSelect('transaction.customer', 'customer')
            .leftJoinAndSelect('transaction.cashier', 'cashier')
            .leftJoinAndSelect('transaction.transactionDetails', 'transactionDetails')
            .leftJoinAndSelect('transactionDetails.stock', 'stock')
            .leftJoinAndSelect('stock.product', 'product')
            .leftJoinAndSelect('product.vendor', 'vendor')
            .orderBy('transaction.transaction_id', 'ASC')
            .getMany();
        if (lodash_1.default.isEmpty(transactions))
            throw errorTypes_1.E_ERROR.TRANSACTION_NOT_FOUND;
        return transactions;
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.searchTransactionService = searchTransactionService;
const updateTransactionService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h;
    const queryRunner = app_1.db.queryRunner();
    try {
        yield queryRunner.startTransaction();
        const transaction = yield transaction_1.Transaction.findOne({ where: { id } });
        const customer = yield customer_1.Customer.findOne({ where: { id: payload.customer_id } });
        if (!transaction)
            throw errorTypes_1.E_ERROR.TRANSACTION_NOT_FOUND;
        if (!customer)
            throw errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND;
        let actual_total_price = 0;
        transaction.transactionDetails.map(detail => {
            var _a, _b;
            const pd = payload.detail.find(detailPayload => detailPayload.id === detail.id);
            if (pd) {
                detail.amount = (_a = pd.amount) !== null && _a !== void 0 ? _a : detail.amount;
                // detail.product_id = pd.productId ?? detail.product_id
                detail.sub_total = (_b = pd.sub_total) !== null && _b !== void 0 ? _b : detail.sub_total;
                actual_total_price += detail.sub_total;
                return detail;
            }
            return detail;
        });
        if (payload.amount_paid && payload.amount_paid < actual_total_price) {
            transaction.status = languageEnums_1.TRANSACTION_STATUS.PENDING;
            transaction.outstanding_amount = actual_total_price - payload.amount_paid;
            // TODO : NEED TO CHECK MONETARY LOGIC
            const customerMonet = new customerMonetary_1.CustomerMonetary();
            customerMonet.customer = customer;
            customerMonet.amount = transaction.outstanding_amount;
            customerMonet.type = hutangPiutang_1.E_Recievables.DEBT;
            yield queryRunner.manager.save(customerMonet);
        }
        else {
            transaction.status = languageEnums_1.TRANSACTION_STATUS.PAID;
            transaction.change = payload.amount_paid ? payload.amount_paid - actual_total_price : transaction.change;
        }
        transaction.expected_total_price = (_e = payload.expected_total_price) !== null && _e !== void 0 ? _e : transaction.expected_total_price;
        transaction.actual_total_price = (_f = payload.actual_total_price) !== null && _f !== void 0 ? _f : transaction.actual_total_price;
        transaction.transaction_date = (_g = payload.transaction_date) !== null && _g !== void 0 ? _g : transaction.transaction_date;
        transaction.amount_paid = (_h = payload.amount_paid) !== null && _h !== void 0 ? _h : transaction.amount_paid;
        yield queryRunner.manager.save(transaction);
        yield queryRunner.commitTransaction();
        return yield transaction_1.Transaction.findOne({ where: { id } });
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        yield queryRunner.release();
    }
});
exports.updateTransactionService = updateTransactionService;
const getTransactionByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield transaction_1.Transaction.findOne({ where: { id }, relations: ['customer', 'transactionDetails'] });
        if (!transaction)
            throw errorTypes_1.E_ERROR.TRANSACTION_NOT_FOUND;
        return transaction;
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.getTransactionByIdService = getTransactionByIdService;
const deleteTransactionService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield transaction_1.Transaction.findOneOrFail({ where: { id } });
        yield transaction.remove();
        return { message: 'Transaction is deleted!' };
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.deleteTransactionService = deleteTransactionService;
