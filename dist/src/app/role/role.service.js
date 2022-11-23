"use strict";
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
exports.getAllRoleService = void 0;
const role_1 = require("@entity/role");
const errorHandler_1 = require("src/errorHandler");
const scopeHelper_1 = require("src/helper/scopeHelper");
const getAllRoleService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield role_1.Role.find({ relations: ['scopes'] });
        const formattedRoles = roles.map(role => {
            return Object.assign(Object.assign({}, role), { scopes: (0, scopeHelper_1.scopeFormatter)(role.scopes) });
        });
        return formattedRoles;
    }
    catch (error) {
        return new errorHandler_1.Errors(error);
    }
});
exports.getAllRoleService = getAllRoleService;
