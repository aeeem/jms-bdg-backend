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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const response_1 = __importDefault(require("src/helper/response"));
const tsoa_1 = require("tsoa");
const transaction_service_1 = require("./transaction.service");
let TransactionController = class TransactionController extends tsoa_1.Controller {
    async getAllTransaction(sort) {
        try {
            const transactions = await (0, transaction_service_1.getAllTransactionService)(sort);
            return response_1.default.success({ data: transactions });
        }
        catch (error) {
            return error;
        }
    }
    async searchTransaction(query, id) {
        try {
            const transactions = await (0, transaction_service_1.searchTransactionService)(query, id);
            return response_1.default.success({ data: transactions });
        }
        catch (error) {
            return error;
        }
    }
    async createTransaction(payload, request) {
        try {
            const user = request.loggedInUser;
            const createdTransaction = await (0, transaction_service_1.createTransactionService)(payload, false, user);
            return response_1.default.success({ data: createdTransaction });
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async getTransactionById(id) {
        try {
            const transaction = await (0, transaction_service_1.getTransactionByIdService)(id);
            return response_1.default.success({ data: transaction });
        }
        catch (error) {
            return error;
        }
    }
    async createPendingTransaction(payload) {
        try {
            const createdTransaction = await (0, transaction_service_1.createTransactionService)(payload, true);
            return response_1.default.success({ data: createdTransaction });
        }
        catch (error) {
            return error;
        }
    }
    async deletePendingTransaction(id) {
        try {
            const deletedTransaction = await (0, transaction_service_1.deletePendingTransactionService)(id);
            return response_1.default.success({ data: deletedTransaction });
        }
        catch (error) {
            return error;
        }
    }
    async updatePendingTransaction(transaction_id, payload) {
        try {
            const deletedTransaction = await (0, transaction_service_1.updatePendingTransactionService)(transaction_id, payload.detail);
            return response_1.default.success({ data: deletedTransaction });
        }
        catch (error) {
            return error;
        }
    }
    async deletePendingTransactionItem(payload) {
        try {
            const deletedTransactionItem = await (0, transaction_service_1.deletePendingTransactionItemService)(payload);
            return response_1.default.success({ data: deletedTransactionItem, stat_msg: `Stock pada transaksi id: ${payload.transaction_id}, sudah di hapus` });
        }
        catch (error) {
            return error;
        }
    }
    async updateTransaction(id, payload) {
        try {
            const updatedTransaction = await (0, transaction_service_1.updateTransactionService)(id, payload);
            return response_1.default.success({ data: updatedTransaction });
        }
        catch (error) {
            return error;
        }
    }
    async deleteTransaction(id) {
        try {
            return await (0, transaction_service_1.deleteTransactionService)(id);
        }
        catch (error) {
            return error;
        }
    }
};
__decorate([
    (0, tsoa_1.Get)('/'),
    (0, tsoa_1.Security)('api_key', ['read:transaction']),
    __param(0, (0, tsoa_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getAllTransaction", null);
__decorate([
    (0, tsoa_1.Get)('/search/'),
    (0, tsoa_1.Security)('api_key', ['read:transaction']),
    __param(0, (0, tsoa_1.Query)('query')),
    __param(1, (0, tsoa_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "searchTransaction", null);
__decorate([
    (0, tsoa_1.Post)('/create'),
    (0, tsoa_1.Security)('api_key', ['create:transaction']),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "createTransaction", null);
__decorate([
    (0, tsoa_1.Get)('/{id}'),
    (0, tsoa_1.Security)('api_key', ['read:transaction']),
    __param(0, (0, tsoa_1.Path)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactionById", null);
__decorate([
    (0, tsoa_1.Post)('/pending'),
    (0, tsoa_1.Security)('api_key', ['create:transaction']),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "createPendingTransaction", null);
__decorate([
    (0, tsoa_1.Delete)('/pending/{id}'),
    (0, tsoa_1.Security)('api_key', ['create:transaction']),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "deletePendingTransaction", null);
__decorate([
    (0, tsoa_1.Put)('/pending/{transaction_id}'),
    (0, tsoa_1.Security)('api_key', ['update:transaction']),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "updatePendingTransaction", null);
__decorate([
    (0, tsoa_1.Patch)('/pending/item'),
    (0, tsoa_1.Security)('api_key', ['create:transaction']),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "deletePendingTransactionItem", null);
__decorate([
    (0, tsoa_1.Put)('/{id}/'),
    (0, tsoa_1.Security)('api_key', ['update:transaction']),
    __param(0, (0, tsoa_1.Path)('id')),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "updateTransaction", null);
__decorate([
    (0, tsoa_1.Delete)('/{id}/'),
    (0, tsoa_1.Security)('api_key', ['delete:transaction']),
    __param(0, (0, tsoa_1.Path)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "deleteTransaction", null);
TransactionController = __decorate([
    (0, tsoa_1.Tags)('Transaction'),
    (0, tsoa_1.Route)('/api/transaction'),
    (0, tsoa_1.Security)('api_key')
], TransactionController);
exports.TransactionController = TransactionController;
