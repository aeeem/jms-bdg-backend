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
exports.deleteCustomerService = exports.updateCustomerService = exports.createCustomerService = exports.searchCustomerService = exports.getAllCustomerService = void 0;
const customer_1 = require("@entity/customer");
const lodash_1 = __importDefault(require("lodash"));
const getAllCustomerService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield customer_1.Customer.find();
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllCustomerService = getAllCustomerService;
const searchCustomerService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.createQueryBuilder()
            .where('name LIKE :query', { query })
            .getMany();
        if (lodash_1.default.isEmpty(customer))
            return { message: "Customer is not found!" };
        return customer;
    }
    catch (error) {
        console.error(error);
    }
});
exports.searchCustomerService = searchCustomerService;
const createCustomerService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _newCustomer = new customer_1.Customer();
        _newCustomer.name = payload.name;
        _newCustomer.contact_number = payload.contact_number;
        yield _newCustomer.save();
        return yield customer_1.Customer.findOne({
            where: { id: _newCustomer.id }
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.createCustomerService = createCustomerService;
const updateCustomerService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.findOneOrFail({ where: { id } });
        customer['name'] = payload.name;
        customer['contact_number'] = payload.contact_number;
        yield customer.save();
        return yield customer_1.Customer.findOne({
            where: { id }
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.updateCustomerService = updateCustomerService;
const deleteCustomerService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_1.Customer.findOneOrFail({ where: { id } });
        yield customer.remove();
        return { message: "Customer is deleted!" };
    }
    catch (error) {
        console.error(error);
    }
});
exports.deleteCustomerService = deleteCustomerService;
