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
exports.StockToko = void 0;
const typeorm_1 = require("typeorm");
const stock_1 = require("./stock");
let StockToko = class StockToko extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockToko.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        scale: 2, precision: 6, nullable: true
    }),
    __metadata("design:type", Number)
], StockToko.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StockToko.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_1.Stock, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'stock_id' }),
    __metadata("design:type", stock_1.Stock)
], StockToko.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], StockToko.prototype, "stock_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StockToko.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StockToko.prototype, "updated_at", void 0);
StockToko = __decorate([
    (0, typeorm_1.Entity)({ name: 'stock_toko' })
], StockToko);
exports.StockToko = StockToko;
