"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorTypes_1 = require("src/constants/errorTypes");
const response_1 = __importDefault(require("src/helper/response"));
const isHandledError = (code) => {
    return code in errorTypes_1.E_ERROR;
};
const isErrorInstance = (err) => {
    return err instanceof Error;
};
const isCustomError = (err) => {
    return err !== undefined;
};
const errorHandleMiddleware = (err, req, res, next) => {
    var _a;
    if (isHandledError(err)) {
        const code = err;
        const error = errorTypes_1.E_ERROR[code];
        const response = response_1.default.error({
            type: code,
            stat_msg: error.message,
            stat_code: error.status
        });
        next(response);
    }
    else if (isErrorInstance(err)) {
        const error = err;
        const response = response_1.default.error({
            type: 'E_NativeError',
            stat_msg: error.message,
            stat_code: 500,
            stack: (_a = error.stack) !== null && _a !== void 0 ? _a : 'no stack defined'
        });
        next(response);
    }
    else if (isCustomError(err)) {
        const error = err;
        const response = response_1.default.error({
            type: 'E_CustomError',
            stat_msg: error.message,
            stat_code: error.status
        });
        next(response);
    }
    else {
        const response = response_1.default.error({
            type: 'E_UnhandledError',
            stat_msg: 'Something went wrong',
            stat_code: 500
        });
        next(response);
    }
};
exports.default = errorHandleMiddleware;
