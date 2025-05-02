"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVendorService = exports.updateVendorService = exports.addVendorService = exports.findVendorService = exports.getAllVendorService = void 0;
const vendor_1 = require("@entity/vendor");
const response_1 = __importDefault(require("src/helper/response"));
const lodash_1 = __importDefault(require("lodash"));
const errorHandler_1 = require("src/errorHandler");
const getAllVendorService = async () => {
    try {
        const vendors = await vendor_1.Vendor.find();
        return response_1.default.success({ data: vendors, stat_msg: 'SUCCESS' });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
};
exports.getAllVendorService = getAllVendorService;
const findVendorService = async (query) => {
    try {
        const vendor = await vendor_1.Vendor.createQueryBuilder('vendor')
            .where('vendor.code LIKE :query', { query: `%${query}%` })
            .getMany();
        if (lodash_1.default.isEmpty(vendor))
            response_1.default.success({ data: vendor, stat_msg: 'NOT_FOUND' });
        return response_1.default.success({ data: vendor, stat_msg: 'SUCCESS' });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
};
exports.findVendorService = findVendorService;
const addVendorService = async (body) => {
    try {
        const _newVendor = new vendor_1.Vendor();
        _newVendor.name = body.name;
        _newVendor.code = body.code;
        _newVendor.shipping_cost = body.shipping_cost ?? 0;
        _newVendor.address = body.address;
        _newVendor.pic_name = body.pic_name;
        _newVendor.pic_phone_number = body.pic_phone_number;
        await _newVendor.save();
        return await vendor_1.Vendor.findOne({ where: { id: _newVendor.id } });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
};
exports.addVendorService = addVendorService;
const updateVendorService = async (id, body) => {
    try {
        const vendor = await vendor_1.Vendor.findOneOrFail({ where: { id } });
        vendor.address = body.address;
        vendor.name = body.name;
        vendor.code = body.code;
        vendor.shipping_cost = body.shipping_cost ?? 0;
        vendor.pic_name = body.pic_name;
        vendor.pic_phone_number = body.pic_phone_number;
        await vendor.save();
        return await vendor_1.Vendor.findOne({ where: { id } });
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
};
exports.updateVendorService = updateVendorService;
const deleteVendorService = async (id) => {
    try {
        const vendor = await vendor_1.Vendor.findOneOrFail({ where: { id } });
        await vendor.remove();
        return { message: 'Vendor is deleted!' };
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
};
exports.deleteVendorService = deleteVendorService;
