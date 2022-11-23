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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerStatusController = void 0;
const tsoa_1 = require("tsoa");
const server_status_service_1 = require("./server.status.service");
let ServerStatusController = class ServerStatusController extends tsoa_1.Controller {
    getServerStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                status: 'server is running',
                serverTime: new Date().toISOString()
            };
        });
    }
    getServerRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, server_status_service_1.getRoutes)();
        });
    }
};
__decorate([
    (0, tsoa_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServerStatusController.prototype, "getServerStatus", null);
__decorate([
    (0, tsoa_1.Get)('/routes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServerStatusController.prototype, "getServerRoutes", null);
ServerStatusController = __decorate([
    (0, tsoa_1.Tags)('Server Status'),
    (0, tsoa_1.Route)('/api/server-status')
], ServerStatusController);
exports.ServerStatusController = ServerStatusController;
