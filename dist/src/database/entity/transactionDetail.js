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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionDetail = void 0;
const typeorm_1 = require("typeorm");
const stock_1 = require("./stock");
const transaction_1 = require("./transaction");
let TransactionDetail = class TransactionDetail extends typeorm_1.BaseEntity {
    id;
    amount;
    sub_total;
    transaction;
    stock;
    stock_id;
    is_box;
    transaction_id;
    created_at;
    updated_at;
    deleted_at;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TransactionDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        precision: 6, scale: 2, nullable: true
    }),
    __metadata("design:type", Number)
], TransactionDetail.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TransactionDetail.prototype, "sub_total", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => transaction_1.Transaction, (transaction) => transaction.transactionDetails, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'transaction_id' }),
    __metadata("design:type", transaction_1.Transaction)
], TransactionDetail.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_1.Stock, (stock) => stock.transactionDetails),
    (0, typeorm_1.JoinColumn)({ name: 'stock_id' }),
    __metadata("design:type", stock_1.Stock)
], TransactionDetail.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TransactionDetail.prototype, "stock_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: false }),
    __metadata("design:type", Boolean)
], TransactionDetail.prototype, "is_box", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], TransactionDetail.prototype, "transaction_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TransactionDetail.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TransactionDetail.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], TransactionDetail.prototype, "deleted_at", void 0);
TransactionDetail = __decorate([
    (0, typeorm_1.Entity)({ name: 'transaction_detail' })
], TransactionDetail);
exports.TransactionDetail = TransactionDetail;
