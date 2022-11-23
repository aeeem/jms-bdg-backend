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
exports.deleteTransactionService = exports.getTransactionByIdService = exports.updateTransactionService = exports.searchTransactionService = exports.createTransactionService = exports.getAllTransactionService = void 0;
const customer_1 = require("@entity/customer");
const customerMonetary_1 = require("@entity/customerMonetary");
const product_1 = require("@entity/product");
const transaction_1 = require("@entity/transaction");
const transactionDetail_1 = require("@entity/transactionDetail");
const lodash_1 = __importDefault(require("lodash"));
const app_1 = require("src/app");
const errorTypes_1 = require("src/constants/errorTypes");
const languageEnums_1 = require("src/constants/languageEnums");
const hutangPiutang_1 = require("src/database/enum/hutangPiutang");
const errorHandler_1 = require("src/errorHandler");
const customer_service_1 = require("../customer/customer.service");
const transaction_helper_1 = require("./transaction.helper");
const getAllTransactionService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield transaction_1.Transaction.find({
            relations: [
                'customer',
                'transactionDetails',
                'transactionDetails.product',
                'transactionDetails.product.stock',
                'transactionDetails.product.stock.vendor'
            ]
        });
        return (0, transaction_helper_1.formatTransaction)(transactions);
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.getAllTransactionService = getAllTransactionService;
const createTransactionService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = app_1.db.queryRunner();
    try {
        yield queryRunner.startTransaction();
        const customer = yield customer_1.Customer.findOne({ where: { id: payload.customer_id } });
        if (customer == null)
            throw errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND;
        const customerDeposit = yield (0, customer_service_1.getCustomerDepositService)(customer.id);
        const products = yield product_1.Product.find({ relations: ['stock'] });
        const expected_total_price = 0;
        const transactionDetails = yield Promise.all(payload.detail.map((transactionDetail) => __awaiter(void 0, void 0, void 0, function* () {
            const product = products.find(product => product.id === transactionDetail.productId);
            if (product == null)
                throw errorTypes_1.E_ERROR.PRODUCT_NOT_FOUND;
            // expected_total_price += product.stock.sell_price * transactionDetail.amount
            // product.stock.total_stock -= transactionDetail.amount
            yield queryRunner.manager.save(product);
            const detail = new transactionDetail_1.TransactionDetail();
            detail.amount = transactionDetail.amount;
            detail.sub_total = transactionDetail.sub_total;
            detail.product_id = transactionDetail.productId;
            return detail;
        })));
        const transactionProcess = new transaction_helper_1.TransactionProcessor(payload, customer, transactionDetails, expected_total_price, customerDeposit.total_deposit);
        yield transactionProcess.start();
        yield queryRunner.commitTransaction();
        return Object.assign(Object.assign({}, transactionProcess.transaction), { customer: Object.assign(Object.assign({}, transactionProcess.transaction.customer), { deposit_balance: (yield (0, customer_service_1.getCustomerDepositService)(transactionProcess.transaction.customer.id)).total_deposit, debt_balance: (yield (0, customer_service_1.getCustomerDebtService)(transactionProcess.transaction.customer.id)).total_debt }) });
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        yield queryRunner.release();
    }
});
exports.createTransactionService = createTransactionService;
const searchTransactionService = (query, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield yield transaction_1.Transaction.find({
            relations: [
                'customer',
                'transactionDetails',
                'transactionDetails.product',
                'transactionDetails.product.stock',
                'transactionDetails.product.stock.vendor'
            ],
            where: id ? { id } : {}
        });
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
    var _a, _b, _c, _d;
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
            var _a, _b, _c;
            const pd = payload.detail.find(detailPayload => detailPayload.id === detail.id);
            if (pd) {
                detail.amount = (_a = pd.amount) !== null && _a !== void 0 ? _a : detail.amount;
                detail.product_id = (_b = pd.productId) !== null && _b !== void 0 ? _b : detail.product_id;
                detail.sub_total = (_c = pd.sub_total) !== null && _c !== void 0 ? _c : detail.sub_total;
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
        transaction.expected_total_price = (_a = payload.expected_total_price) !== null && _a !== void 0 ? _a : transaction.expected_total_price;
        transaction.actual_total_price = (_b = payload.actual_total_price) !== null && _b !== void 0 ? _b : transaction.actual_total_price;
        transaction.transaction_date = (_c = payload.transaction_date) !== null && _c !== void 0 ? _c : transaction.transaction_date;
        transaction.amount_paid = (_d = payload.amount_paid) !== null && _d !== void 0 ? _d : transaction.amount_paid;
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
