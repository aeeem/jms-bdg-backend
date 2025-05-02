"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCashInService = exports.createCashOutService = exports.getCashFlowService = void 0;
const cashFlow_1 = require("@entity/cashFlow");
const cashFlow_2 = require("src/database/enum/cashFlow");
const errorHandler_1 = require("src/errorHandler");
const getCashFlowService = async (year, month, week) => {
    // Monthly
    if (month && !week) {
        return await cashFlow_1.CashFlow
            .createQueryBuilder()
            .leftJoinAndSelect('CashFlow.transaction', 'transaction')
            .where('extract(month from CashFlow.created_at)= :month', { month })
            .andWhere('extract(year from CashFlow.created_at)= :year', { year })
            .getMany();
    }
    // Weekly
    if (!month && week) {
        return await cashFlow_1.CashFlow
            .createQueryBuilder()
            .leftJoinAndSelect('CashFlow.transaction', 'transaction')
            .where('extract(week from CashFlow.created_at)=:week', { week })
            .andWhere('extract(year from CashFlow.created_at)=:year', { year })
            .getMany();
    }
};
exports.getCashFlowService = getCashFlowService;
const createCashOutService = async (payload) => {
    try {
        const cashFlow = new cashFlow_1.CashFlow();
        cashFlow.amount = payload.amount;
        cashFlow.code = cashFlow_2.E_CashFlowCode.OUT_MISC;
        cashFlow.type = cashFlow_2.E_CashFlowType.CashOut;
        cashFlow.cash_type = payload.cash_type;
        cashFlow.note = payload.note;
        if (payload.transaction_date) {
            cashFlow.created_at = payload.transaction_date;
        }
        await cashFlow.save();
        return cashFlow;
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.createCashOutService = createCashOutService;
const createCashInService = async (payload) => {
    try {
        const cashFlow = new cashFlow_1.CashFlow();
        cashFlow.amount = payload.amount;
        cashFlow.code = cashFlow_2.E_CashFlowCode.IN_ADJUSTMENT;
        cashFlow.type = cashFlow_2.E_CashFlowType.CashIn;
        cashFlow.note = payload.note;
        cashFlow.cash_type = payload.cash_type;
        if (payload.transaction_date) {
            cashFlow.created_at = payload.transaction_date;
        }
        await cashFlow.save();
        return cashFlow;
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.createCashInService = createCashInService;
