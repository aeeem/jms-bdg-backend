"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.GudangController = void 0;
const response_1 = __importDefault(require("src/helper/response"));
const tsoa_1 = require("tsoa");
const gudang_service_1 = require("./gudang.service");
let GudangController = class GudangController extends tsoa_1.Controller {
    getStockGudang() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stocks = yield (0, gudang_service_1.getStockGudangService)();
                return response_1.default.success({ data: stocks });
            }
            catch (error) {
                return error;
            }
        });
    }
    pindahStockGudang(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stocks = yield (0, gudang_service_1.pindahStockGudangService)(payload);
                return response_1.default.success({ data: stocks });
            }
            catch (error) {
                return error;
            }
        });
    }
    tambahStockGudang(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const stocks = await tambahStockGudangService( payload )
                // return makeResponse.success( { data: stocks } )
            }
            catch (error) {
                return error;
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Get)('/'),
    (0, tsoa_1.Security)('api_key', ['read:gudang']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GudangController.prototype, "getStockGudang", null);
__decorate([
    (0, tsoa_1.Post)('/pindah-stok'),
    (0, tsoa_1.Security)('api_key', ['update:gudang']),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], GudangController.prototype, "pindahStockGudang", null);
__decorate([
    (0, tsoa_1.Post)('/'),
    (0, tsoa_1.Security)('api_key', ['create:gudang']),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GudangController.prototype, "tambahStockGudang", null);
GudangController = __decorate([
    (0, tsoa_1.Tags)('Gudang'),
    (0, tsoa_1.Route)('/api/gudang'),
    (0, tsoa_1.Security)('api_key')
], GudangController);
exports.GudangController = GudangController;
