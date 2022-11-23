"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = void 0;
const errorTypes_1 = require("src/constants/errorTypes");
const tsoa_1 = require("tsoa");
class Errors extends Error {
    constructor(err) {
        var _a;
        super();
        this.isHandledError = (code) => {
            const keys = Object.keys(errorTypes_1.E_ERROR);
            return keys.some(key => errorTypes_1.E_ERROR[key] === code);
        };
        this.isErrorInstance = (err) => {
            return err instanceof Error;
        };
        this.isCustomError = (err) => {
            return err !== undefined;
        };
        this.getErrorType = (code) => {
            const keys = Object.keys(errorTypes_1.E_ERROR);
            const errType = keys.find(key => errorTypes_1.E_ERROR[key] === code);
            return errType;
        };
        this.unhandledError = () => {
            this.response = {
                type: 'E_UnhandledError',
                stat_msg: 'Something went wrong',
                stat_code: 500
            };
        };
        this.errorParser = (err) => {
            var _a;
            if (err instanceof tsoa_1.ValidateError) {
                this.response = {
                    type: 'VALIDATION_ERROR',
                    stat_msg: 'Validation Failed',
                    stat_code: 422,
                    details: err.fields
                };
            }
            else if (this.isHandledError(err)) {
                const type = this.getErrorType(err);
                const error = err;
                this.response =
                    {
                        type,
                        stat_msg: error.message,
                        stat_code: error.status
                    };
            }
            else if (this.isErrorInstance(err)) {
                const error = err;
                this.response = {
                    type: 'E_NativeError',
                    stat_msg: error.message,
                    stat_code: 500,
                    stack: (_a = error.stack) !== null && _a !== void 0 ? _a : 'no stack defined'
                };
            }
            else if (this.isCustomError(err)) {
                const error = err;
                this.response = {
                    type: 'E_CustomError',
                    stat_msg: error.message,
                    stat_code: error.status
                };
            }
            else {
                // this.unhandledError()
            }
            return this.response;
        };
        // this.errorTypeParser()
        const error = this.errorParser(err);
        this.type = error.type;
        this.stat_msg = (_a = error.stat_msg) !== null && _a !== void 0 ? _a : 'Internal Server Error';
        this.stat_code = error.stat_code;
    }
}
exports.Errors = Errors;
