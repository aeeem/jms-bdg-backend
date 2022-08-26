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
exports.StockController = void 0;
const tsoa_1 = require("tsoa");
const stock_service_1 = require("./stock.service");
let StockController = class StockController extends tsoa_1.Controller {
    getAllStock() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, stock_service_1.getAllStocksService)();
        });
    }
    updateStock(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, stock_service_1.updateStockService)(body, id);
        });
    }
    deleteStock(id) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    patchStock(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, stock_service_1.updateStockService)(body, id);
        });
    }
    findStock(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, stock_service_1.findStockService)(query);
        });
    }
};
__decorate([
    (0, tsoa_1.Get)('/'),
    (0, tsoa_1.Security)('api_key', ['read:stock']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getAllStock", null);
__decorate([
    (0, tsoa_1.Put)('/{id}'),
    (0, tsoa_1.Security)('api_key', ['update:stock']),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "updateStock", null);
__decorate([
    (0, tsoa_1.Delete)('/{id}/'),
    (0, tsoa_1.Security)('api_key', ['delete:stock']),
    __param(0, (0, tsoa_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "deleteStock", null);
__decorate([
    (0, tsoa_1.Patch)('/{id}/'),
    (0, tsoa_1.Security)('api_key', ['update:stock']),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "patchStock", null);
__decorate([
    (0, tsoa_1.Get)('/search/:query'),
    (0, tsoa_1.Security)('api_key', ['read:stock']),
    __param(0, (0, tsoa_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "findStock", null);
StockController = __decorate([
    (0, tsoa_1.Tags)('Stock'),
    (0, tsoa_1.Route)('/api/stock'),
    (0, tsoa_1.Security)('api_key')
], StockController);
exports.StockController = StockController;
