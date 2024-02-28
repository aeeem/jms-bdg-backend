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
exports.deleteCustomerService = exports.updateCustomerService = exports.createCustomerService = exports.searchCustomerService = exports.payDebtService = exports.addDepositService = exports.getCustomerDebtService = exports.getCustomerDepositService = exports.getCustomerByIdService = exports.getAllCustomerService = void 0;
const customer_1 = require("@entity/customer");
const customerMonetary_1 = require("@entity/customerMonetary");
const app_1 = require("src/app");
const errorTypes_1 = require("src/constants/errorTypes");
const hutangPiutang_1 = require("src/database/enum/hutangPiutang");
const errorHandler_1 = require("src/errorHandler");
const monetaryHelper_1 = require("src/helper/monetaryHelper");
const AccountCode_1 = require("src/interface/AccountCode");
const cashFlow_1 = require("@entity/cashFlow");
const cashFlow_2 = require("src/database/enum/cashFlow");
const getAllCustomerService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield customer_1.Customer.find({ relations: ['transactions', 'monetary'] });
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.getAllCustomerService = getAllCustomerService;
const getCustomerByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.findOne({
            where: { id },
            relations: ['transactions', 'monetary']
        });
        if (customer == null)
            throw errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND;
        return customer;
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.getCustomerByIdService = getCustomerByIdService;
const getCustomerDepositService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer_deposit = yield customerMonetary_1.CustomerMonetary.find({ where: { customer_id: id, type: hutangPiutang_1.E_Recievables.DEPOSIT } });
        const total_deposit = (0, monetaryHelper_1.CalculateTotalBalance)(customer_deposit);
        return {
            total_deposit,
            deposits: customer_deposit
        };
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.getCustomerDepositService = getCustomerDepositService;
const getCustomerDebtService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer_debt = yield customerMonetary_1.CustomerMonetary.find({ where: { customer_id: id, type: hutangPiutang_1.E_Recievables.DEBT } });
        const total_debt = (0, monetaryHelper_1.CalculateTotalBalance)(customer_debt);
        return {
            total_debt,
            debts: customer_debt
        };
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.getCustomerDebtService = getCustomerDebtService;
const addDepositService = ({ amount, customer_id, is_transfer, description }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.findOne({ where: { id: customer_id } });
        if (!customer)
            throw errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND;
        const customerMonetary = new customerMonetary_1.CustomerMonetary();
        customerMonetary.customer_id = customer.id;
        customerMonetary.amount = amount;
        customerMonetary.type = hutangPiutang_1.E_Recievables.DEPOSIT;
        customerMonetary.source = is_transfer ? AccountCode_1.E_CODE_KEY.DEP_ADD_CASH_DEPOSIT_TRANSFER : AccountCode_1.E_CODE_KEY.DEP_ADD_CASH_DEPOSIT;
        if (description) {
            customerMonetary.description = description;
        }
        yield customerMonetary.save();
        const cashFlow = new cashFlow_1.CashFlow();
        cashFlow.amount = amount;
        cashFlow.code = cashFlow_2.E_CashFlowCode.IN_ADD_DEPOSIT;
        cashFlow.type = cashFlow_2.E_CashFlowType.CashIn;
        cashFlow.cash_type = is_transfer ? cashFlow_2.E_CashType.TRANSFER : cashFlow_2.E_CashType.CASH;
        cashFlow.note = `${customer.name} Tambah Deposit`; // temporary harcode
        return customerMonetary;
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.addDepositService = addDepositService;
const payDebtService = ({ amount, customer_id, is_transfer, description }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.findOne({ where: { id: customer_id } });
        if (!customer)
            throw errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND;
        const customerMonetary = new customerMonetary_1.CustomerMonetary();
        customerMonetary.customer_id = customer.id;
        customerMonetary.amount = amount;
        customerMonetary.type = hutangPiutang_1.E_Recievables.DEBT;
        customerMonetary.source = is_transfer ? AccountCode_1.E_CODE_KEY.DEBT_SUB_PAY_WITH_TRANSFER : AccountCode_1.E_CODE_KEY.DEBT_SUB_PAY_WITH_CASH;
        if (description) {
            customerMonetary.description = description;
        }
        yield customerMonetary.save();
        const cashFlow = new cashFlow_1.CashFlow();
        cashFlow.amount = amount;
        cashFlow.code = cashFlow_2.E_CashFlowCode.IN_PAY_DEBT;
        cashFlow.type = cashFlow_2.E_CashFlowType.CashIn;
        cashFlow.cash_type = is_transfer ? cashFlow_2.E_CashType.TRANSFER : cashFlow_2.E_CashType.CASH;
        cashFlow.note = `Pembayaran Hutang : ${customer.name}`; // temporary harcode
        cashFlow.customer = customer;
        yield cashFlow.save();
        return customerMonetary;
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.payDebtService = payDebtService;
const searchCustomerService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.createQueryBuilder('customer')
            .where('UPPER(customer.name) LIKE UPPER(:query)', { query: `%${query}%` })
            .leftJoinAndSelect('customer.monetary', 'monetary')
            .leftJoinAndSelect('customer.transactions', 'transactions')
            .orderBy('customer.id', 'ASC')
            .getMany();
        return customer;
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.searchCustomerService = searchCustomerService;
const createCustomerService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const queryRunner = app_1.db.queryRunner();
    try {
        yield queryRunner.startTransaction();
        const _newCustomer = new customer_1.Customer();
        _newCustomer.name = payload.name;
        _newCustomer.contact_number = (_a = payload.contact_number) !== null && _a !== void 0 ? _a : '';
        yield queryRunner.manager.save(_newCustomer);
        const _customerMonet = new customerMonetary_1.CustomerMonetary();
        _customerMonet.customer = _newCustomer;
        // if ( payload.hutang ) {
        //   _customerMonet.amount = payload.hutang
        //   _customerMonet.type = E_Recievables.DEBT
        // } else if ( payload.piutang ) {
        //   _customerMonet.amount = payload.piutang
        //   _customerMonet.type = E_Recievables.DEPOSIT
        // }
        // if ( payload.hutang ?? payload.piutang ) {
        //   await queryRunner.manager.save( _customerMonet )
        // }
        yield queryRunner.commitTransaction();
        const customer = yield customer_1.Customer.findOne({ where: { id: _newCustomer.id } });
        return customer;
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        yield queryRunner.release();
    }
});
exports.createCustomerService = createCustomerService;
const updateCustomerService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.findOne({ where: { id } });
        if (customer != null) {
            customer.name = payload.name ? payload.name : customer.name;
            customer.contact_number = payload.contact_number ? payload.contact_number : customer.contact_number;
            yield customer.save();
        }
        else
            throw errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND;
        return yield customer_1.Customer.findOne({ where: { id } });
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.updateCustomerService = updateCustomerService;
const deleteCustomerService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.findOne({ where: { id } });
        if (customer != null) {
            yield customer.remove();
        }
        else
            throw errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND;
    }
    catch (error) {
        return yield Promise.reject(new errorHandler_1.Errors(error));
    }
});
exports.deleteCustomerService = deleteCustomerService;
