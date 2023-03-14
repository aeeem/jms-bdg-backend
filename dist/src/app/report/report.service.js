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
exports.getVendorReportService = exports.getCashReportService = exports.getDailyReportService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const cashFlow_1 = require("@entity/cashFlow");
const transaction_1 = require("@entity/transaction");
const vendor_1 = require("@entity/vendor");
const dayjs_1 = __importDefault(require("dayjs"));
const date_1 = require("src/constants/date");
const cashFlow_2 = require("src/database/enum/cashFlow");
const transaction_2 = require("src/database/enum/transaction");
const report_helper_1 = require("./report.helper");
const getDailyReportService = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_1.Transaction.find({ where: { status: transaction_2.E_TransactionStatus.FINISHED }, relations: ['customer'] });
    const cashFlow = yield cashFlow_1.CashFlow.createQueryBuilder()
        .where('Date(CashFlow.created_at) = current_date')
        .andWhere('CashFlow.code = :type', { type: cashFlow_2.E_CashFlowCode.IN_ADJUSTMENT })
        .getMany();
    const todayTransaction = transactions.filter(transaction => (0, dayjs_1.default)(transaction === null || transaction === void 0 ? void 0 : transaction.transaction_date).format(date_1.DateFormat) === date.format(date_1.DateFormat));
    const yesterdayTransaction = transactions.filter(transactions => (0, dayjs_1.default)(transactions === null || transactions === void 0 ? void 0 : transactions.transaction_date).format(date_1.DateFormat) === date.subtract(1, 'day').format(date_1.DateFormat));
    const cashFlowFormatted = cashFlow.map(cf => {
        return {
            id: cf.id,
            note: cf.note,
            type: cf.cash_type,
            sub_total_cash: cf.cash_type === 'cash' ? cf.amount : 0,
            sub_total_transfer: cf.cash_type === 'transfer' ? cf.amount : 0
        };
    });
    const transactionFormatted = todayTransaction.map(transaction => {
        var _a, _b;
        return {
            id: transaction.id,
            note: (_b = (_a = transaction.customer) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '',
            type: transaction.is_transfer ? cashFlow_2.E_CashType.TRANSFER : cashFlow_2.E_CashType.TRANSFER,
            sub_total_cash: !transaction.is_transfer ? transaction.actual_total_price : 0,
            sub_total_transfer: transaction.is_transfer ? transaction.actual_total_price : 0
        };
    });
    const yesterdayTransactionFormatted = yesterdayTransaction.map(transaction => ({
        id: transaction.id,
        note: 'Stock Tunai (Total transaksi H-1)',
        type: `${cashFlow_2.E_CashType.CASH} / ${cashFlow_2.E_CashType.TRANSFER}`,
        sub_total_cash: !transaction.is_transfer ? transaction.actual_total_price : 0,
        sub_total_transfer: transaction.is_transfer ? transaction.actual_total_price : 0
    })).reduce((acc, curr) => {
        return {
            id: curr.id,
            note: 'Stock Tunai (Total transaksi H-1)',
            type: curr.type,
            sub_total_cash: acc.sub_total_cash + curr.sub_total_cash,
            sub_total_transfer: acc.sub_total_transfer + curr.sub_total_transfer
        };
    });
    return {
        yesterdayTransaction: yesterdayTransactionFormatted,
        todayTransactions: [...cashFlowFormatted, ...transactionFormatted]
    };
});
exports.getDailyReportService = getDailyReportService;
const getCashReportService = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_1.Transaction.find({ relations: ['customer'] });
    const cashFlows = yield cashFlow_1.CashFlow.find();
    return (0, report_helper_1.reportFormatter)(cashFlows, transactions);
});
exports.getCashReportService = getCashReportService;
const getVendorReportService = (month) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_1.Vendor.find({
        relations: [
            'products',
            'products.stocks',
            'products.stocks.transactionDetails'
        ]
    });
});
exports.getVendorReportService = getVendorReportService;
