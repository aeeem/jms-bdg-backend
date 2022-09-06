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
exports.deleteCustomerService = exports.updateCustomerService = exports.createCustomerService = exports.searchCustomerService = exports.getCustomerByIdService = exports.getAllCustomerService = void 0;
const customer_1 = require("@entity/customer");
const customerMonetary_1 = require("@entity/customerMonetary");
const lodash_1 = __importDefault(require("lodash"));
const app_1 = require("src/app");
const hutangPiutang_1 = require("src/database/enum/hutangPiutang");
const errorHandler_1 = require("src/errorHandler");
const enums_1 = require("src/errorHandler/enums");
const getAllCustomerService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield customer_1.Customer.find({ relations: [
                'transactions',
                'monetary'
            ] });
    }
    catch (error) {
        return error;
    }
});
exports.getAllCustomerService = getAllCustomerService;
const getCustomerByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.findOne({
            where: { id },
            relations: [
                'transactions',
                'monetary',
            ]
        });
        if (!customer)
            throw enums_1.E_ErrorType.E_CUSTOMER_NOT_FOUND;
        return customer;
    }
    catch (error) {
        console.log(error);
        return Promise.reject(new errorHandler_1.ErrorHandler(error));
    }
});
exports.getCustomerByIdService = getCustomerByIdService;
const searchCustomerService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.createQueryBuilder("customer")
            .where('customer.name LIKE :query', { query: `%${query}%` })
            .leftJoinAndSelect('customer.monetary', 'monetary')
            .leftJoinAndSelect('customer.transactions', 'transactions')
            .orderBy('customer.id', 'ASC')
            .getMany();
        if (lodash_1.default.isEmpty(customer))
            throw enums_1.E_ErrorType.E_CUSTOMER_NOT_FOUND;
        return customer;
    }
    catch (error) {
        throw new errorHandler_1.ErrorHandler(error);
    }
});
exports.searchCustomerService = searchCustomerService;
const createCustomerService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = app_1.db.queryRunner();
    try {
        yield queryRunner.startTransaction();
        const _newCustomer = new customer_1.Customer();
        _newCustomer.name = payload.name;
        _newCustomer.contact_number = payload.contact_number;
        yield queryRunner.manager.save(_newCustomer);
        const _customerMonet = new customerMonetary_1.CustomerMonetary();
        _customerMonet.customer = _newCustomer;
        if (payload.hutang) {
            _customerMonet.amount = payload.hutang;
            _customerMonet.type = hutangPiutang_1.E_Recievables.DEBT;
        }
        else if (payload.piutang) {
            _customerMonet.amount = payload.piutang;
            _customerMonet.type = hutangPiutang_1.E_Recievables.RECIEVABLE;
        }
        if (payload.hutang || payload.piutang) {
            yield queryRunner.manager.save(_customerMonet);
        }
        yield queryRunner.commitTransaction();
        return yield customer_1.Customer.findOne({
            where: { id: _newCustomer.id }
        });
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        return error;
    }
    finally {
        yield queryRunner.release();
    }
});
exports.createCustomerService = createCustomerService;
const updateCustomerService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.findOne({ where: { id } });
        if (customer) {
            customer['name'] = payload.name ? payload.name : customer['name'];
            customer['contact_number'] = payload.contact_number ? payload.contact_number : customer['contact_number'];
            yield customer.save();
        }
        else
            throw enums_1.E_ErrorType.E_CUSTOMER_NOT_FOUND;
        return yield customer_1.Customer.findOne({
            where: { id }
        });
    }
    catch (error) {
        throw new errorHandler_1.ErrorHandler(error);
    }
});
exports.updateCustomerService = updateCustomerService;
const deleteCustomerService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.findOne({ where: { id } });
        if (customer) {
            yield customer.remove();
        }
        else
            throw enums_1.E_ErrorType.E_CUSTOMER_NOT_FOUND;
    }
    catch (error) {
        throw new errorHandler_1.ErrorHandler(error);
    }
});
exports.deleteCustomerService = deleteCustomerService;
