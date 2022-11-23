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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorController = void 0;
const tsoa_1 = require("tsoa");
const vendor_service_1 = require("./vendor.service");
let VendorController = class VendorController extends tsoa_1.Controller {
    getAllVendor() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, vendor_service_1.getAllVendorService)();
        });
    }
    findVendor(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, vendor_service_1.findVendorService)(query);
        });
    }
    addVendor(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, vendor_service_1.addVendorService)(body);
        });
    }
    updateVendor(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, vendor_service_1.updateVendorService)(id, body);
        });
    }
    deleteVendor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, vendor_service_1.deleteVendorService)(id);
        });
    }
};
__decorate([
    (0, tsoa_1.Get)('/'),
    (0, tsoa_1.Security)('api_key', ['read:vendor']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getAllVendor", null);
__decorate([
    (0, tsoa_1.Get)('/search/'),
    (0, tsoa_1.Security)('api_key', ['read:vendor']),
    __param(0, (0, tsoa_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "findVendor", null);
__decorate([
    (0, tsoa_1.Post)('/'),
    (0, tsoa_1.Security)('api_key', ['create:vendor']),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "addVendor", null);
__decorate([
    (0, tsoa_1.Put)('/'),
    (0, tsoa_1.Security)('api_key', ['update:vendor']),
    __param(0, (0, tsoa_1.Query)('id')),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateVendor", null);
__decorate([
    (0, tsoa_1.Delete)('/'),
    (0, tsoa_1.Security)('api_key', ['delete:vendor']),
    __param(0, (0, tsoa_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "deleteVendor", null);
VendorController = __decorate([
    (0, tsoa_1.Tags)('Vendor'),
    (0, tsoa_1.Route)('/api/vendor')
], VendorController);
exports.VendorController = VendorController;
