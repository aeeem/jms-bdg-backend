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
exports.CashFlowController = void 0;
const response_1 = __importDefault(require("src/helper/response"));
const tsoa_1 = require("tsoa");
const cashflow_service_1 = require("./cashflow.service");
let CashFlowController = class CashFlowController extends tsoa_1.Controller {
    createCashOut(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, cashflow_service_1.createCashOutService)(body);
                return response_1.default.success({ data });
            }
            catch (error) {
                return error;
            }
        });
    }
    createCashIn(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, cashflow_service_1.createCashInService)(body);
                return response_1.default.success({ data });
            }
            catch (error) {
                return error;
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('api_key'),
    (0, tsoa_1.Post)('/cash-out'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CashFlowController.prototype, "createCashOut", null);
__decorate([
    (0, tsoa_1.Security)('api_key'),
    (0, tsoa_1.Post)('/cash-in'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CashFlowController.prototype, "createCashIn", null);
CashFlowController = __decorate([
    (0, tsoa_1.Tags)('Cashflow'),
    (0, tsoa_1.Route)('/api/cash-flow')
], CashFlowController);
exports.CashFlowController = CashFlowController;
