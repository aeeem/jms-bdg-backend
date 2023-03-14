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
exports.CashFlow = void 0;
const typeorm_1 = require("typeorm");
const cashFlow_1 = require("../enum/cashFlow");
const transaction_1 = require("./transaction");
let CashFlow = class CashFlow extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CashFlow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: cashFlow_1.E_CashFlowCode
    }),
    __metadata("design:type", String)
], CashFlow.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: cashFlow_1.E_CashFlowType
    }),
    __metadata("design:type", String)
], CashFlow.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: cashFlow_1.E_CashType.CASH }),
    __metadata("design:type", String)
], CashFlow.prototype, "cash_type", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => transaction_1.Transaction, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'transaction_id' }),
    __metadata("design:type", transaction_1.Transaction)
], CashFlow.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CashFlow.prototype, "transaction_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CashFlow.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CashFlow.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CashFlow.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CashFlow.prototype, "updated_at", void 0);
CashFlow = __decorate([
    (0, typeorm_1.Entity)('CashFlow')
], CashFlow);
exports.CashFlow = CashFlow;
