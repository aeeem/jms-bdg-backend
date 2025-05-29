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
exports.ProductsController = void 0;
const response_1 = __importStar(require("src/helper/response"));
const tsoa_1 = require("tsoa");
const product_service_1 = require("./product.service");
let ProductsController = class ProductsController extends tsoa_1.Controller {
    async getAllProducts(page, limit, orderByColumn, Order, search, startDate, endDate, vendor) {
        if (orderByColumn !== 'last_transaction_date' &&
            orderByColumn !== undefined) {
            orderByColumn = `${String(orderByColumn)}`;
        }
        if (orderByColumn === undefined) {
            orderByColumn = 'id';
        }
        const { product, count } = await (0, product_service_1.getAllProductsService)((0, response_1.OffsetFromPage)(page, limit), limit, orderByColumn, Order, search, vendor, startDate, endDate);
        return response_1.default.successWithPagination({
            data: product,
            totalData: count,
            page: page,
            limit: limit,
            totalPage: (0, response_1.TotalPage)(count, limit),
            stat_msg: 'SUCCESS'
        });
    }
    async createProduct(payload) {
        try {
            return await (0, product_service_1.createProductService)(payload);
        }
        catch (error) {
            return error;
        }
    }
    async updateProduct(id, payload) {
        return await (0, product_service_1.updateProductService)(Number(id), payload);
    }
    async deleteProduct(id) {
        return await (0, product_service_1.deleteProductService)({ id: Number(id) });
    }
    async searchProduct(query) {
        return await (0, product_service_1.searchProductService)({ query });
    }
    async createMixedProduct(payload) {
        try {
            const addCampur = await (0, product_service_1.addMixedProductService)(payload);
            return response_1.default.success({ data: addCampur, stat_code: 200 });
        }
        catch (error) {
            return error;
        }
    }
};
__decorate([
    (0, tsoa_1.Get)('/'),
    (0, tsoa_1.Security)('api_key', ['read:product']),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Query)()),
    __param(6, (0, tsoa_1.Query)()),
    __param(7, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAllProducts", null);
__decorate([
    (0, tsoa_1.Post)('/'),
    (0, tsoa_1.Security)('api_key', ['create:product']),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProduct", null);
__decorate([
    (0, tsoa_1.Put)('/'),
    (0, tsoa_1.Security)('api_key', ['update:product']),
    __param(0, (0, tsoa_1.Query)('id')),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, tsoa_1.Delete)('/'),
    (0, tsoa_1.Security)('api_key', ['delete:product']),
    __param(0, (0, tsoa_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProduct", null);
__decorate([
    (0, tsoa_1.Get)('/search/'),
    (0, tsoa_1.Security)('api_key', ['read:product']),
    __param(0, (0, tsoa_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "searchProduct", null);
__decorate([
    (0, tsoa_1.Post)('/add-campur'),
    (0, tsoa_1.Security)('api_key', ['create:product']),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createMixedProduct", null);
ProductsController = __decorate([
    (0, tsoa_1.Tags)('Products'),
    (0, tsoa_1.Route)('/api/products')
], ProductsController);
exports.ProductsController = ProductsController;
