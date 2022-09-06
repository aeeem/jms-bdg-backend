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
exports.TransactionController = void 0;
const response_1 = __importDefault(require("src/helper/response"));
const tsoa_1 = require("tsoa");
const transaction_service_1 = require("./transaction.service");
let TransactionController = class TransactionController extends tsoa_1.Controller {
    getAllTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield (0, transaction_service_1.getAllTransactionService)();
                return response_1.default.success({
                    data: transactions
                });
            }
            catch (error) {
                return error;
            }
        });
    }
    createTransaction(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdTransaction = yield (0, transaction_service_1.createTransactionService)(payload);
                return response_1.default.success({
                    data: createdTransaction
                });
            }
            catch (error) {
                return error;
            }
        });
    }
    updateTransaction(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    deleteTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, transaction_service_1.deleteTransactionService)(id);
        });
    }
    searchTransaction(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, transaction_service_1.searchTransactionService)(query);
        });
    }
};
__decorate([
    (0, tsoa_1.Get)('/'),
    (0, tsoa_1.Security)('api_key', ['read:transaction']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getAllTransaction", null);
__decorate([
    (0, tsoa_1.Post)('/'),
    (0, tsoa_1.Security)('api_key', ['create:transaction']),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "createTransaction", null);
__decorate([
    (0, tsoa_1.Put)('/{id}/'),
    (0, tsoa_1.Security)('api_key', ['update:transaction']),
    __param(0, (0, tsoa_1.Query)('id')),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "updateTransaction", null);
__decorate([
    (0, tsoa_1.Delete)('/{id}/'),
    (0, tsoa_1.Security)('api_key', ['delete:transaction']),
    __param(0, (0, tsoa_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "deleteTransaction", null);
__decorate([
    (0, tsoa_1.Get)('/search/:query'),
    (0, tsoa_1.Security)('api_key', ['read:transaction']),
    __param(0, (0, tsoa_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "searchTransaction", null);
TransactionController = __decorate([
    (0, tsoa_1.Tags)('Transaction'),
    (0, tsoa_1.Route)('/api/transaction'),
    (0, tsoa_1.Security)('api_key')
], TransactionController);
exports.TransactionController = TransactionController;
