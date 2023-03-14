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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCashInService = exports.createCashOutService = exports.getCashFlowService = void 0;
const cashFlow_1 = require("@entity/cashFlow");
const cashFlow_2 = require("src/database/enum/cashFlow");
const getCashFlowService = (year, month, week) => __awaiter(void 0, void 0, void 0, function* () {
    // Monthly
    if (month && !week) {
        return yield cashFlow_1.CashFlow
            .createQueryBuilder()
            .leftJoinAndSelect('CashFlow.transaction', 'transaction')
            .where('extract(month from CashFlow.created_at)= :month', { month })
            .andWhere('extract(year from CashFlow.created_at)= :year', { year })
            .getMany();
    }
    // Weekly
    if (!month && week) {
        return yield cashFlow_1.CashFlow
            .createQueryBuilder()
            .leftJoinAndSelect('CashFlow.transaction', 'transaction')
            .where('extract(week from CashFlow.created_at)=:week', { week })
            .andWhere('extract(year from CashFlow.created_at)=:year', { year })
            .getMany();
    }
});
exports.getCashFlowService = getCashFlowService;
const createCashOutService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const cashFlow = new cashFlow_1.CashFlow();
    cashFlow.amount = payload.amount;
    cashFlow.code = cashFlow_2.E_CashFlowCode.OUT_MISC;
    cashFlow.type = cashFlow_2.E_CashFlowType.CashOut;
    cashFlow.cash_type = payload.cash_type;
    cashFlow.note = payload.note;
    yield cashFlow.save();
    return cashFlow;
});
exports.createCashOutService = createCashOutService;
const createCashInService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const cashFlow = new cashFlow_1.CashFlow();
    cashFlow.amount = payload.amount;
    cashFlow.code = cashFlow_2.E_CashFlowCode.IN_ADJUSTMENT;
    cashFlow.type = cashFlow_2.E_CashFlowType.CashIn;
    cashFlow.note = payload.note;
    yield cashFlow.save();
    return cashFlow;
});
exports.createCashInService = createCashInService;
