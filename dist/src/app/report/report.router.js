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
exports.ReportController = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const response_1 = __importDefault(require("src/helper/response"));
const tsoa_1 = require("tsoa");
const cashflow_service_1 = require("../cashflow/cashflow.service");
const report_service_1 = require("./report.service");
let ReportController = class ReportController extends tsoa_1.Controller {
    async getDailyReport(date_param, type_cash) {
        try {
            const date = date_param ? (0, dayjs_1.default)(date_param) : (0, dayjs_1.default)();
            const data = await (0, report_service_1.getDailyReportService)(date, type_cash);
            return response_1.default.success({ data });
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async getCashFlow(year, month, week) {
        try {
            const data = await (0, cashflow_service_1.getCashFlowService)(year, month, week);
            return response_1.default.success({ data });
        }
        catch (error) {
            return error;
        }
    }
    async getCashReport() {
        try {
            const data = await (0, report_service_1.getCashReportService)();
            return response_1.default.success({ data });
        }
        catch (error) {
            return error;
        }
    }
    async getSupplierReport(month) {
        try {
            const monthParam = month ?? (0, dayjs_1.default)().month();
            const data = await (0, report_service_1.getVendorReportService)(monthParam);
            return response_1.default.success({ data });
        }
        catch (error) {
            return error;
        }
    }
};
__decorate([
    (0, tsoa_1.Security)('api_key'),
    (0, tsoa_1.Get)('/daily'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getDailyReport", null);
__decorate([
    (0, tsoa_1.Security)('api_key'),
    (0, tsoa_1.Get)('/cash-flow'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getCashFlow", null);
__decorate([
    (0, tsoa_1.Security)('api_key'),
    (0, tsoa_1.Get)('/cash-report'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getCashReport", null);
__decorate([
    (0, tsoa_1.Security)('api_key'),
    (0, tsoa_1.Get)('/supplier'),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getSupplierReport", null);
ReportController = __decorate([
    (0, tsoa_1.Tags)('Report'),
    (0, tsoa_1.Route)('/api/report')
], ReportController);
exports.ReportController = ReportController;
