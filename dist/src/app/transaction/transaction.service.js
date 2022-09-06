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
exports.deleteTransactionService = exports.updateTransactionService = exports.searchTransactionService = exports.createTransactionService = exports.getAllTransactionService = void 0;
const customer_1 = require("@entity/customer");
const product_1 = require("@entity/product");
const transaction_1 = require("@entity/transaction");
const transactionDetail_1 = require("@entity/transactionDetail");
const lodash_1 = __importDefault(require("lodash"));
const app_1 = require("src/app");
const languageEnums_1 = require("src/constants/languageEnums");
const errorHandler_1 = require("src/errorHandler");
const enums_1 = require("src/errorHandler/enums");
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
        return transactions.map(transaction => {
            return {
                id: transaction.id,
                expected_total_price: transaction.expected_total_price,
                actual_total_price: transaction.actual_total_price,
                amount_paid: transaction.amount_paid,
                change: transaction.change,
                outstanding_amount: transaction.outstanding_amount,
                customer: {
                    id: transaction.customer.id,
                    name: transaction.customer.name,
                    phone: transaction.customer.contact_number,
                },
                items: transaction.transactionDetails.map(detail => {
                    return {
                        id: detail.id,
                        amount: detail.amount,
                        final_price: detail.final_price,
                        product: {
                            id: detail.product.id,
                            name: detail.product.name,
                            vendor: detail.product.stock.vendor.name
                        },
                        sub_total: detail.sub_total
                    };
                }),
                status: transaction.status,
                created_at: transaction.created_at,
                updated_at: transaction.updated_at
            };
        });
    }
    catch (error) {
        console.log(error);
        return Promise.reject(new errorHandler_1.ErrorHandler(error));
    }
});
exports.getAllTransactionService = getAllTransactionService;
const createTransactionService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = app_1.db.queryRunner();
    try {
        yield queryRunner.startTransaction();
        const customer = yield customer_1.Customer.findOne({ where: { id: payload.customer_id } });
        if (!customer)
            throw enums_1.E_ErrorType.E_CUSTOMER_NOT_FOUND;
        const products = yield product_1.Product.find({ relations: ['stock'] });
        let expected_total_price = 0;
        let actual_total_price = 0;
        const transactionDetails = yield Promise.all(payload.detail.map((transactionDetail) => __awaiter(void 0, void 0, void 0, function* () {
            const product = products.find((product) => product.id === transactionDetail.productId);
            if (!product)
                throw enums_1.E_ErrorType.E_PRODUCT_NOT_FOUND;
            expected_total_price += product.stock.sell_price * transactionDetail.amount;
            actual_total_price += transactionDetail.final_price * transactionDetail.amount;
            product.stock.total_stock -= transactionDetail.amount;
            yield queryRunner.manager.save(product);
            const detail = new transactionDetail_1.TransactionDetail();
            detail.amount = transactionDetail.amount;
            detail.final_price = transactionDetail.final_price;
            detail.sub_total = transactionDetail.sub_total;
            detail.product_id = transactionDetail.productId;
            return detail;
        })));
        // safety check in-case someone try to alter the payload incorrectly
        if (expected_total_price !== payload.expected_total_price)
            throw enums_1.E_ErrorType.E_EXPECTED_TOTAL_PRICE_NOT_MATCH;
        const transaction = new transaction_1.Transaction();
        transaction.customer = customer;
        transaction.transactionDetails = transactionDetails;
        transaction.expected_total_price = expected_total_price;
        transaction.actual_total_price = payload.actual_total_price;
        transaction.amount_paid = payload.amount_paid;
        if (payload.amount_paid < actual_total_price) {
            transaction.status = languageEnums_1.TRANSACTION_STATUS.PENDING;
            transaction.outstanding_amount = actual_total_price - payload.amount_paid;
        }
        else {
            transaction.status = languageEnums_1.TRANSACTION_STATUS.PAID;
            transaction.change = payload.amount_paid - actual_total_price;
        }
        yield queryRunner.manager.save(transaction);
        yield queryRunner.commitTransaction();
        return transaction;
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        console.log(error);
        return Promise.reject(new errorHandler_1.ErrorHandler(error));
    }
    finally {
        yield queryRunner.release();
    }
});
exports.createTransactionService = createTransactionService;
const searchTransactionService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield transaction_1.Transaction.createQueryBuilder()
            .leftJoinAndMapMany('detail', 'TransactionDetail', 'detail.id = transaction.id')
            .leftJoinAndMapMany('customer', 'Customer', 'customer.id = transaction.customer_id')
            .where('transaction.id LIKE :query OR customer.name LIKE :query', { query })
            .getMany();
        if (lodash_1.default.isEmpty(transaction))
            return { message: "Transaction is not found!" };
        return transaction;
    }
    catch (error) {
        return Promise.reject(new errorHandler_1.ErrorHandler(error));
    }
});
exports.searchTransactionService = searchTransactionService;
const updateTransactionService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield transaction_1.Transaction.findOneOrFail({ where: { id } });
        const customer = yield customer_1.Customer.findOneOrFail({ where: { id: payload.customer_id } });
        transaction['expected_total_price'] = payload.expected_total_price;
        transaction['actual_total_price'] = payload.actual_total_price;
        transaction['customer'] = customer;
        yield transaction.save();
        return yield transaction_1.Transaction.findOne({
            where: { id }
        });
    }
    catch (error) {
        return Promise.reject(new errorHandler_1.ErrorHandler(error));
    }
});
exports.updateTransactionService = updateTransactionService;
const deleteTransactionService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield transaction_1.Transaction.findOneOrFail({ where: { id } });
        yield transaction.remove();
        return { message: "Transaction is deleted!" };
    }
    catch (error) {
        return Promise.reject(new errorHandler_1.ErrorHandler(error));
    }
});
exports.deleteTransactionService = deleteTransactionService;
