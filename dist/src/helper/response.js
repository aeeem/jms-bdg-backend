"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.success = void 0;
const success = ({ data, stat_code = 200, stat_msg = '' }) => {
    return {
        data,
        stat_code,
        stat_msg
    };
};
exports.success = success;
const error = ({ type, stat_code = 400, stat_msg = '', stack }) => {
    return {
        type,
        stat_code,
        stat_msg,
        stack
    };
};
exports.error = error;
const makeResponse = {
    success: exports.success,
    error: exports.error
};
exports.default = makeResponse;
