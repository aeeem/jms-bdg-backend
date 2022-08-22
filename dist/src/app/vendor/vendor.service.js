"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const response = __importStar(require("src/helper/response"));
const lodash_1 = __importDefault(require("lodash"));
const getAllVendorService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield vendor_1.Vendor.find();
        return response.success({ data: vendors, stat_msg: "SUCCESS" });
    }
    catch (error) {
        response.error({ stat_msg: "FAILED", stat_code: 404 });
    }
});
exports.getAllVendorService = getAllVendorService;
const findVendorService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = yield vendor_1.Vendor.createQueryBuilder()
            .where('vendor.code LIKE :query', { query })
            .getMany();
        if (lodash_1.default.isEmpty(vendor))
            return { message: "Vendor is not found!" };
        return response.success({ data: vendor, stat_msg: "SUCCESS" });
    }
    catch (error) {
        console.error(error);
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
        return yield vendor_1.Vendor.findOne({
            where: { id: _newVendor.id }
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.addVendorService = addVendorService;
const updateVendorService = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = yield vendor_1.Vendor.findOneOrFail({ where: { id } });
        vendor['address'] = body.address;
        vendor['name'] = body.name;
        vendor['code'] = body.code;
        vendor['shipping_cost'] = body.shipping_cost;
        vendor['pic_name'] = body.pic_name;
        vendor['pic_phone_number'] = body.pic_phone_number;
        yield vendor.save();
        return yield vendor_1.Vendor.findOne({
            where: { id }
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.updateVendorService = updateVendorService;
const deleteVendorService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = yield vendor_1.Vendor.findOneOrFail({ where: { id } });
        yield vendor.remove();
        return { message: "Vendor is deleted!" };
    }
    catch (error) {
        console.error(error);
    }
});
exports.deleteVendorService = deleteVendorService;
