"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportFormatter = exports.sumOf = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const date_1 = require("src/constants/date");
const cashFlow_1 = require("src/database/enum/cashFlow");
const sumOf = (transactions) => {
    return transactions.reduce((prevValue, transaction) => {
        return prevValue + transaction.amount_paid;
    }, 0);
};
exports.sumOf = sumOf;
const reportFormatter = (cashFlows, transactions) => {
    const formattedCashFlow = cashFlows.map(cashFlow => {
        var _a;
        return ({
            id: cashFlow.id,
            date: (0, dayjs_1.default)(cashFlow.created_at).format(date_1.DateFormat),
            no_nota: '-',
            notes: (_a = cashFlow.note) !== null && _a !== void 0 ? _a : null,
            cash_in: cashFlow.type === cashFlow_1.E_CashFlowType.CashIn ? cashFlow.amount : 0,
            cash_out: cashFlow.type === cashFlow_1.E_CashFlowType.CashOut ? cashFlow.amount : 0
        });
    });
    const formattedTransaction = transactions.map(transaction => {
        var _a, _b;
        return ({
            id: transaction.transaction_id,
            date: (transaction === null || transaction === void 0 ? void 0 : transaction.transaction_date) ? (0, dayjs_1.default)(transaction.transaction_date).format(date_1.DateFormat) : '-',
            no_nota: transaction.transaction_id,
            notes: (_b = (_a = transaction.customer) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null,
            cash_in: transaction.actual_total_price,
            cash_out: 0
        });
    });
    return [...formattedCashFlow, ...formattedTransaction];
};
exports.reportFormatter = reportFormatter;
