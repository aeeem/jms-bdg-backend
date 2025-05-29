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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const response_1 = __importStar(require("src/helper/response"));
const tsoa_1 = require("tsoa");
const transaction_service_1 = require("./transaction.service");
let TransactionController = class TransactionController extends tsoa_1.Controller {
    async getAllTransaction(page, limit, orderByColumn, Order, search, startDate, endDate) {
        try {
            if (orderByColumn !== 'created_at' &&
                orderByColumn !== undefined) {
                orderByColumn = `${String(orderByColumn)}`;
            }
            if (orderByColumn === undefined) {
                orderByColumn = 'id';
            }
            const { transactions, count } = await (0, transaction_service_1.getAllTransactionService)((0, response_1.OffsetFromPage)(page, limit), limit, orderByColumn, Order, search, startDate, endDate);
            return response_1.default.successWithPagination({
                data: transactions,
                totalData: +count | 0,
                page,
                limit,
                totalPage: (0, response_1.TotalPage)(+count | 0, limit),
                stat_msg: 'SUCCESS'
            });
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
            return response_1.default.success({
                data: deletedTransactionItem,
                stat_msg: `Stock pada transaksi id: ${payload.transaction_id}, sudah di hapus`
            });
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
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Query)()),
    __param(6, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String]),
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
