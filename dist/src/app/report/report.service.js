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
const typeorm_1 = require("typeorm");
const report_helper_1 = require("./report.helper");
const getDailyReportService = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const cashFlow = yield cashFlow_1.CashFlow.find({
        relations: ['transaction'],
        where: { created_at: (0, typeorm_1.Raw)(alias => `${alias} >= current_date - 1`) }
    });
    const rawTodayCashFlow = cashFlow.filter(cf => (0, dayjs_1.default)(cf === null || cf === void 0 ? void 0 : cf.created_at).format(date_1.DateFormat) === date.format(date_1.DateFormat));
    const rawYesterdayCashFlow = cashFlow.filter(cf => (0, dayjs_1.default)(cf === null || cf === void 0 ? void 0 : cf.created_at).format(date_1.DateFormat) === date.subtract(1, 'day').format(date_1.DateFormat));
    const todayCashFlow = rawTodayCashFlow.map(cf => {
        var _a, _b;
        return {
            id: cf.id,
            note: cf.transaction ? (_b = (_a = cf.transaction.customer) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '' : cf.note,
            type: cf.cash_type,
            flow_type: cf.type,
            sub_total_cash: cf.cash_type === cashFlow_2.E_CashType.CASH ? cf.amount : 0,
            sub_total_transfer: cf.cash_type === cashFlow_2.E_CashType.TRANSFER ? cf.amount : 0
        };
    });
    const yesterdayCashflow = rawYesterdayCashFlow.map(cf => ({
        id: cf.id,
        note: 'Stock Tunai (Total transaksi H-1)',
        type: `${cashFlow_2.E_CashType.CASH} / ${cashFlow_2.E_CashType.TRANSFER}`,
        sub_total_cash: cf.cash_type === cashFlow_2.E_CashType.CASH ? cf.amount : 0,
        sub_total_transfer: cf.cash_type === cashFlow_2.E_CashType.TRANSFER ? cf.amount : 0,
        flow_type: cf.type
    })).reduceRight((acc, curr) => {
        return {
            id: curr.id,
            note: curr.note,
            type: curr.type,
            sub_total_cash: curr.flow_type === cashFlow_2.E_CashFlowType.CashIn ? acc.sub_total_cash + curr.sub_total_cash : acc.sub_total_cash - curr.sub_total_cash,
            sub_total_transfer: curr.flow_type === cashFlow_2.E_CashFlowType.CashIn ? acc.sub_total_transfer + curr.sub_total_transfer : acc.sub_total_transfer - curr.sub_total_transfer,
            flow_type: curr.flow_type
        };
    });
    return {
        todayCashFlow,
        yesterdayCashflow
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
    return vendor;
});
exports.getVendorReportService = getVendorReportService;
