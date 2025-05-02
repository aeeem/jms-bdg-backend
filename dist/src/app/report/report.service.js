"use strict";
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
const getDailyReportService = async (date, typeCash = cashFlow_2.E_CashFlowType.CashIn) => {
    const flowType = typeCash === cashFlow_2.E_CashFlowType.CashIn ? typeCash : cashFlow_2.E_CashFlowType.CashOut;
    const cashFlow = await cashFlow_1.CashFlow.find({
        relations: [
            'transaction',
            'transaction.customer',
            'customer'
        ],
        where: { created_at: (0, typeorm_1.Raw)(alias => `date(${alias}) BETWEEN '${date.subtract(1, 'day').format('YYYY-MM-DD')}' AND '${date.format('YYYY-MM-DD')}'`), type: flowType },
        order: { created_at: 'DESC' }
    });
    const rawTodayCashFlow = cashFlow.filter(cf => (0, dayjs_1.default)(cf?.created_at).format(date_1.DateFormat) === date.format(date_1.DateFormat));
    const rawYesterdayCashFlow = cashFlow.filter(cf => (0, dayjs_1.default)(cf?.created_at).format(date_1.DateFormat) === date.subtract(1, 'day').format(date_1.DateFormat));
    const todayCashFlow = rawTodayCashFlow.map(cf => {
        const payDebtAmount = cf.transaction ? cf.transaction_id ? cf.transaction.pay_debt_amount : 0 : 0;
        const customerName = cf.customer ? cf.customer_id ? cf.customer.name : cf.transaction.customer?.name : '';
        return {
            id: cf.id,
            note: cf.note,
            type: cf.cash_type,
            flow_type: cf.type,
            sub_total_cash: cf.cash_type === cashFlow_2.E_CashType.CASH ? cf.amount + payDebtAmount : 0,
            sub_total_transfer: cf.cash_type === cashFlow_2.E_CashType.TRANSFER ? cf.amount + payDebtAmount : 0,
            customerName
        };
    });
    const yesterdayCashflow = rawYesterdayCashFlow.length
        ? rawYesterdayCashFlow.map(cf => {
            const payDebtAmount = cf.transaction ? cf.transaction_id ? cf.transaction.pay_debt_amount : 0 : 0;
            return {
                id: cf.id,
                note: 'Sistem Stock Tunai (Total transaksi H-1)',
                type: `${cashFlow_2.E_CashType.CASH} / ${cashFlow_2.E_CashType.TRANSFER}`,
                sub_total_cash: cf.cash_type === cashFlow_2.E_CashType.CASH ? cf.amount + payDebtAmount : 0,
                sub_total_transfer: cf.cash_type === cashFlow_2.E_CashType.TRANSFER ? cf.amount + payDebtAmount : 0,
                flow_type: cf.type
            };
        })?.reduceRight((acc, curr) => {
            return {
                id: curr.id,
                note: curr.note,
                type: curr.type,
                sub_total_cash: acc.sub_total_cash + curr.sub_total_cash,
                sub_total_transfer: acc.sub_total_transfer + curr.sub_total_transfer,
                flow_type: curr.flow_type
            };
        })
        : {};
    return {
        todayCashFlow,
        yesterdayCashflow
    };
};
exports.getDailyReportService = getDailyReportService;
const getCashReportService = async () => {
    const transactions = await transaction_1.Transaction.find({ relations: ['customer'] });
    const cashFlows = await cashFlow_1.CashFlow.find();
    return (0, report_helper_1.reportFormatter)(cashFlows, transactions);
};
exports.getCashReportService = getCashReportService;
const getVendorReportService = async (month) => {
    const vendor = await vendor_1.Vendor.find({
        relations: [
            'products',
            'products.stocks',
            'products.stocks.transactionDetails'
        ]
    });
    return vendor;
};
exports.getVendorReportService = getVendorReportService;
