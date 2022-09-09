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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeEmployeeRoleService = exports.deleteEmployeeService = exports.updateEmployeeService = exports.createEmployeeService = exports.getAllEmployeeService = void 0;
const role_1 = require("@entity/role");
const user_1 = require("@entity/user");
const employee_interface_1 = require("src/app/employee/employee.interface");
const errorHandler_1 = require("src/errorHandler");
const enums_1 = require("src/errorHandler/enums");
const bcrypt_1 = require("src/helper/bcrypt");
const response_1 = __importDefault(require("src/helper/response"));
const typeorm_1 = require("typeorm");
const getAllEmployeeService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield user_1.User.find({
            where: {
                role: {
                    role: (0, typeorm_1.Not)(employee_interface_1.RoleLists.SuperAdmin)
                }
            },
            relations: ['role']
        });
        const formatResponse = employees.map(employee => {
            return {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                noInduk: employee.noInduk,
                role: employee.role.role
            };
        });
        return response_1.default.success({ data: formatResponse, stat_msg: "SUCCESS" });
    }
    catch (error) {
        console.log(error);
        return new errorHandler_1.ErrorHandler(error);
    }
});
exports.getAllEmployeeService = getAllEmployeeService;
const createEmployeeService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = new user_1.User();
        const defaultPassword = yield (0, bcrypt_1.createHashPassword)('masuk123');
        if (defaultPassword instanceof Error)
            throw defaultPassword.message;
        employee.name = payload.name;
        employee.email = payload.email;
        employee.noInduk = payload.noInduk;
        employee.birth_date = payload.birth_date;
        employee.phone_number = payload.phone_number;
        employee.role_id = payload.role_id;
        employee.password = defaultPassword;
        yield employee.save();
        return employee;
    }
    catch (error) {
        console.log(error);
        return new errorHandler_1.ErrorHandler(error);
    }
});
exports.createEmployeeService = createEmployeeService;
const updateEmployeeService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const employee = yield user_1.User.findOne(id);
        if (!employee)
            throw enums_1.E_ErrorType.E_EMPLOYEE_NOT_FOUND;
        employee.name = (_a = payload.name) !== null && _a !== void 0 ? _a : employee.name;
        employee.email = (_b = payload.email) !== null && _b !== void 0 ? _b : employee.email;
        employee.noInduk = (_c = payload.noInduk) !== null && _c !== void 0 ? _c : employee.noInduk;
        employee.birth_date = (_d = payload.birth_date) !== null && _d !== void 0 ? _d : employee.birth_date;
        employee.phone_number = (_e = payload.phone_number) !== null && _e !== void 0 ? _e : employee.phone_number;
        employee.role_id = (_f = payload.role_id) !== null && _f !== void 0 ? _f : employee.role_id;
        yield employee.save();
        return employee;
    }
    catch (error) {
        console.log(error);
        return new errorHandler_1.ErrorHandler(error);
    }
});
exports.updateEmployeeService = updateEmployeeService;
const deleteEmployeeService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield user_1.User.findOne(id);
        if (!employee)
            throw enums_1.E_ErrorType.E_EMPLOYEE_NOT_FOUND;
        yield employee.remove();
        return employee;
    }
    catch (error) {
        console.log(error);
        return new errorHandler_1.ErrorHandler(error);
    }
});
exports.deleteEmployeeService = deleteEmployeeService;
const changeEmployeeRoleService = (id, role_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (role_id < 2)
            throw enums_1.E_ErrorType.E_FORBIDDEN_ROLE_INPUT;
        const employee = yield user_1.User.findOne(id);
        const role = yield role_1.Role.findOne(role_id);
        if (!employee)
            throw enums_1.E_ErrorType.E_EMPLOYEE_NOT_FOUND;
        if (!role)
            throw enums_1.E_ErrorType.E_ROLE_NOT_FOUND;
        employee.role_id = role_id;
        yield employee.save();
        return employee;
    }
    catch (error) {
        console.log(error);
        return new errorHandler_1.ErrorHandler(error);
    }
});
exports.changeEmployeeRoleService = changeEmployeeRoleService;
