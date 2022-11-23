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
exports.deleteVendorService = exports.updateVendorService = exports.addVendorService = exports.findVendorService = exports.getAllVendorService = void 0;
const vendor_1 = require("@entity/vendor");
const response_1 = __importDefault(require("src/helper/response"));
const lodash_1 = __importDefault(require("lodash"));
const errorHandler_1 = require("src/errorHandler");
const getAllVendorService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield vendor_1.Vendor.find();
        return response_1.default.success({ data: vendors, stat_msg: 'SUCCESS' });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
});
exports.getAllVendorService = getAllVendorService;
const findVendorService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = yield vendor_1.Vendor.createQueryBuilder('vendor')
            .where('vendor.code LIKE :query', { query: `%${query}%` })
            .getMany();
        if (lodash_1.default.isEmpty(vendor))
            response_1.default.success({ data: vendor, stat_msg: 'NOT_FOUND' });
        return response_1.default.success({ data: vendor, stat_msg: 'SUCCESS' });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
});
exports.findVendorService = findVendorService;
const addVendorService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _newVendor = new vendor_1.Vendor();
        _newVendor.name = body.name;
        _newVendor.code = body.code;
        _newVendor.shipping_cost = body.shipping_cost;
        _newVendor.address = body.address;
        _newVendor.pic_name = body.pic_name;
        _newVendor.pic_phone_number = body.pic_phone_number;
        yield _newVendor.save();
        return yield vendor_1.Vendor.findOne({ where: { id: _newVendor.id } });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
});
exports.addVendorService = addVendorService;
const updateVendorService = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = yield vendor_1.Vendor.findOneOrFail({ where: { id } });
        vendor.address = body.address;
        vendor.name = body.name;
        vendor.code = body.code;
        vendor.shipping_cost = body.shipping_cost;
        vendor.pic_name = body.pic_name;
        vendor.pic_phone_number = body.pic_phone_number;
        yield vendor.save();
        return yield vendor_1.Vendor.findOne({ where: { id } });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
});
exports.updateVendorService = updateVendorService;
const deleteVendorService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = yield vendor_1.Vendor.findOneOrFail({ where: { id } });
        yield vendor.remove();
        return { message: 'Vendor is deleted!' };
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
});
exports.deleteVendorService = deleteVendorService;
