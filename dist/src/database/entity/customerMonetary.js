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
exports.CustomerMonetary = void 0;
const AccountCode_1 = require("src/interface/AccountCode");
const typeorm_1 = require("typeorm");
const hutangPiutang_1 = require("../enum/hutangPiutang");
const customer_1 = require("./customer");
const transaction_1 = require("./transaction");
let CustomerMonetary = class CustomerMonetary extends typeorm_1.BaseEntity {
    id;
    type;
    amount;
    source;
    transaction_id;
    customer_id;
    customer;
    transaction;
    created_at;
    updated_at;
    description;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CustomerMonetary.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: hutangPiutang_1.E_Recievables
    }),
    __metadata("design:type", String)
], CustomerMonetary.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CustomerMonetary.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AccountCode_1.E_CODE_KEY
    }),
    __metadata("design:type", String)
], CustomerMonetary.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CustomerMonetary.prototype, "transaction_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CustomerMonetary.prototype, "customer_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_1.Customer, (customer) => customer.monetary, { onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_1.Customer)
], CustomerMonetary.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => transaction_1.Transaction, (transaction) => transaction.customerMonetary, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'transaction_id' }),
    __metadata("design:type", transaction_1.Transaction)
], CustomerMonetary.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CustomerMonetary.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CustomerMonetary.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerMonetary.prototype, "description", void 0);
CustomerMonetary = __decorate([
    (0, typeorm_1.Entity)('customer_monetary')
], CustomerMonetary);
exports.CustomerMonetary = CustomerMonetary;
