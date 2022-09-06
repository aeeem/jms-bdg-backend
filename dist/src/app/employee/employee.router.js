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
exports.employeeController = void 0;
const response_1 = __importDefault(require("src/helper/response"));
const tsoa_1 = require("tsoa");
const employee_service_1 = require("./employee.service");
let employeeController = class employeeController extends tsoa_1.Controller {
    getAllEmployee() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (0, employee_service_1.getAllEmployeeService)();
            }
            catch (error) {
                console.log('[Employee] fail get employee');
            }
        });
    }
    createEmployee(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdEmployee = yield (0, employee_service_1.createEmployeeService)(body);
                return response_1.default.success({
                    data: createdEmployee
                });
            }
            catch (error) {
                return error;
            }
        });
    }
    updateEmployee(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedEmployee = yield (0, employee_service_1.updateEmployeeService)(id, body);
                return response_1.default.success({
                    data: updatedEmployee
                });
            }
            catch (error) {
                return error;
            }
        });
    }
    deleteEmployee(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedEmployee = yield (0, employee_service_1.deleteEmployeeService)(id);
                return response_1.default.success({
                    data: deletedEmployee
                });
            }
            catch (error) {
                return error;
            }
        });
    }
    changeEmployeeRole(id, { role_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patchedEmployee = yield (0, employee_service_1.changeEmployeeRoleService)(id, role_id);
                return response_1.default.success({
                    data: patchedEmployee
                });
            }
            catch (error) {
                return error;
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('api_key', ['read:pegawai']),
    (0, tsoa_1.Get)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], employeeController.prototype, "getAllEmployee", null);
__decorate([
    (0, tsoa_1.Security)('api_key', ['create:pegawai']),
    (0, tsoa_1.Post)('/'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], employeeController.prototype, "createEmployee", null);
__decorate([
    (0, tsoa_1.Security)('api_key', ['update:pegawai']),
    (0, tsoa_1.Put)('/{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], employeeController.prototype, "updateEmployee", null);
__decorate([
    (0, tsoa_1.Security)('api_key', ['delete:pegawai']),
    (0, tsoa_1.Delete)('/{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], employeeController.prototype, "deleteEmployee", null);
__decorate([
    (0, tsoa_1.Security)('api_key', ['update:pegawai']),
    (0, tsoa_1.Patch)('/{id}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], employeeController.prototype, "changeEmployeeRole", null);
employeeController = __decorate([
    (0, tsoa_1.Tags)('Pegawai'),
    (0, tsoa_1.Route)('/api/pegawai')
], employeeController);
exports.employeeController = employeeController;
