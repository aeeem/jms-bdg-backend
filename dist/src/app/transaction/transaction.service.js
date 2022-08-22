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
const stock_1 = require("@entity/stock");
const transaction_1 = require("@entity/transaction");
const transactionDetail_1 = require("@entity/transactionDetail");
const lodash_1 = __importDefault(require("lodash"));
const getAllTransactionService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield transaction_1.Transaction.find({
            relations: [
                'customer',
                'transactionDetails',
                'transactionDetails.stock',
                'transactionDetails.stock.product',
                'transactionDetails.stock.vendor'
            ]
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllTransactionService = getAllTransactionService;
const createTransactionService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.findOneOrFail({ where: { id: payload.customer_id } });
        const transactionDetails = yield Promise.all(payload.detail.map((detail) => __awaiter(void 0, void 0, void 0, function* () {
            const stock = yield stock_1.Stock.findOneOrFail({ where: { id: detail.productId } });
            const _newTransactionDetail = new transactionDetail_1.TransactionDetail();
            _newTransactionDetail.amount = detail.amount;
            _newTransactionDetail.final_price = detail.final_price;
            _newTransactionDetail.sub_total = detail.sub_total;
            _newTransactionDetail.stock = stock;
            return _newTransactionDetail;
        })));
        const transaction = new transaction_1.Transaction();
        transaction.customer = customer;
        transaction.transactionDetails = transactionDetails;
        transaction.expected_total_price = payload.expected_total_price;
        transaction.actual_total_price = payload.actual_total_price;
        return yield transaction.save();
    }
    catch (error) {
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
    }
});
exports.deleteTransactionService = deleteTransactionService;
