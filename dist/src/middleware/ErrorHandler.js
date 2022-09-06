"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.E_ErrorType = void 0;
const enums_1 = require("src/errorHandler/enums");
const response_1 = __importDefault(require("src/helper/response"));
var E_ErrorType;
(function (E_ErrorType) {
    E_ErrorType["E_UNAUTHORIZED"] = "E_UNAUTHORIZED";
    E_ErrorType["E_FORBIDDEN"] = "E_FORBIDDEN";
    E_ErrorType["E_INTERNAL_SERVER_ERROR"] = "E_INTERNAL_SERVER_ERROR";
    E_ErrorType["E_BAD_REQUEST"] = "E_BAD_REQUEST";
    E_ErrorType["ER_DUP_ENTRY"] = "ER_DUP_ENTRY";
    E_ErrorType["E_PRODUCT_OR_VENDOR_NOT_FOUND"] = "E_PRODUCT_OR_VENDOR_NOT_FOUND";
    E_ErrorType["E_VENDOR_NOT_FOUND"] = "Partai tidak ditemukan.";
    E_ErrorType["E_USER_EXISTS"] = "User already exists";
    E_ErrorType["E_LOGIN_WRONG_PASSWORD"] = "Password salah!";
    E_ErrorType["E_LOGIN_WRONG_NIP"] = "No Induk tidak ditemukan";
    E_ErrorType["E_VALIDATION_ERROR"] = "E_VALIDATION_ERROR";
    E_ErrorType["E_USER_NOT_FOUND"] = "User not found";
    E_ErrorType["E_USER_IS_NOT_AUTHORIZED"] = "User is not authorized";
    E_ErrorType["E_TOKEN_EXPIRED"] = "Token expired";
})(E_ErrorType = exports.E_ErrorType || (exports.E_ErrorType = {}));
const ErrorMessages = {
    E_FORBIDDEN_ROLE_INPUT: { message: "Pembuatan user dengan role super admin tidak diperbolehkan", status: enums_1.HTTP_CODE.FORBIDDEN },
    E_ROLE_NOT_FOUND: { message: "Role tidak ditemukan", status: enums_1.HTTP_CODE.NO_CONTENT },
    E_EMPLOYEE_NOT_FOUND: { message: "Pegawai tidak ditemukan", status: enums_1.HTTP_CODE.NO_CONTENT },
    E_EXPECTED_TOTAL_PRICE_NOT_MATCH: { message: "Total tidak sesuai", status: enums_1.HTTP_CODE.FORBIDDEN },
    E_PRODUCT_NOT_FOUND: { message: "Product tidak ditemukan", status: enums_1.HTTP_CODE.NO_CONTENT },
    E_STOCK_NOT_FOUND: { message: "Stock Tidak ditemukan", status: enums_1.HTTP_CODE.NOT_FOUND },
    E_CUSTOMER_NOT_FOUND: { message: "Pelanggan Tidak ditemukan", status: enums_1.HTTP_CODE.NO_CONTENT },
    E_DATABASE_ERROR: { message: 'E_DATABASE_ERROR', status: enums_1.HTTP_CODE.INTERNAL_SERVER_ERROR },
    E_UNKNOWN_ERROR: { message: 'E_UNKNOWN_ERROR', status: enums_1.HTTP_CODE.INTERNAL_SERVER_ERROR },
    E_NOT_FOUND: { message: 'E_NOT_FOUND', status: enums_1.HTTP_CODE.NO_CONTENT },
    E_UNAUTHORIZED: { message: 'E_UNAUTHORIZED', status: enums_1.HTTP_CODE.UNAUTHORIZED },
    E_FORBIDDEN: { message: 'E_FORBIDDEN', status: enums_1.HTTP_CODE.FORBIDDEN },
    E_INTERNAL_SERVER_ERROR: { message: 'E_INTERNAL_SERVER_ERROR', status: enums_1.HTTP_CODE.INTERNAL_SERVER_ERROR },
    E_BAD_REQUEST: { message: 'E_BAD_REQUEST', status: enums_1.HTTP_CODE.BAD_REQUEST },
    ER_DUP_ENTRY: { message: 'ER_DUP_ENTRY', status: enums_1.HTTP_CODE.BAD_REQUEST },
    E_PRODUCT_OR_VENDOR_NOT_FOUND: { message: 'E_PRODUCT_OR_VENDOR_NOT_FOUND', status: enums_1.HTTP_CODE.NO_CONTENT },
    E_VENDOR_NOT_FOUND: { message: 'Partai tidak ditemukan.', status: enums_1.HTTP_CODE.NO_CONTENT },
    E_USER_EXISTS: { message: 'User already exists', status: enums_1.HTTP_CODE.BAD_REQUEST },
    E_LOGIN_WRONG_PASSWORD: { message: 'Password salah!', status: enums_1.HTTP_CODE.UNAUTHORIZED },
    E_LOGIN_WRONG_NIP: { message: 'No Induk tidak ditemukan', status: enums_1.HTTP_CODE.UNAUTHORIZED },
    E_VALIDATION_ERROR: { message: 'E_VALIDATION_ERROR', status: enums_1.HTTP_CODE.BAD_REQUEST },
    E_USER_NOT_FOUND: { message: 'User not found', status: enums_1.HTTP_CODE.NO_CONTENT },
    E_USER_IS_NOT_AUTHORIZED: { message: 'User is not authorized', status: enums_1.HTTP_CODE.UNAUTHORIZED },
    E_TOKEN_EXPIRED: { message: 'Token expired', status: enums_1.HTTP_CODE.UNAUTHORIZED },
};
const isHandledError = (code) => {
    return code in ErrorMessages;
};
const isErrorInstance = (err) => {
    return err instanceof Error;
};
const isCustomError = (err) => {
    return err !== undefined;
};
const errorHandleMiddleware = (err, req, res, next) => {
    if (isHandledError(err)) {
        const code = err;
        const error = ErrorMessages[code];
        const response = response_1.default.error({
            type: code,
            stat_msg: error.message,
            stat_code: error.status,
        });
        next(response);
    }
    else if (isErrorInstance(err)) {
        const error = err;
        const response = response_1.default.error({
            type: "E_NativeError",
            stat_msg: error.message,
            stat_code: 500,
            stack: error.stack || 'no stack defined'
        });
        next(response);
    }
    else if (isCustomError(err)) {
        const error = err;
        const response = response_1.default.error({
            type: "E_CustomError",
            stat_msg: error.message,
            stat_code: error.status,
        });
        next(response);
    }
    else {
        const response = response_1.default.error({
            type: "E_UnhandledError",
            stat_msg: "Something went wrong",
            stat_code: 500,
        });
        next(response);
    }
};
exports.default = errorHandleMiddleware;
