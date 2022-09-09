"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const enums_1 = require("./enums");
class ErrorHandler extends Error {
    constructor(err) {
        super();
        this.err = err;
        this.errorTypeParser();
    }
    getEnumKeyByEnumValue(myEnum, enumValue) {
        const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
        return keys.length > 0 ? keys[0] : '';
    }
    errorTypeParser() {
        switch (this.err) {
            case enums_1.E_ErrorType.E_FORBIDDEN_ROLE_INPUT:
                this.type = this.getEnumKeyByEnumValue(enums_1.E_ErrorType, this.err);
                ;
                this.message = enums_1.E_ErrorType.E_FORBIDDEN_ROLE_INPUT;
                this.status = enums_1.HTTP_CODE.NOT_FOUND;
                break;
            case enums_1.E_ErrorType.E_ROLE_NOT_FOUND:
                this.type = this.getEnumKeyByEnumValue(enums_1.E_ErrorType, this.err);
                ;
                this.message = enums_1.E_ErrorType.E_ROLE_NOT_FOUND;
                this.status = enums_1.HTTP_CODE.NOT_FOUND;
                break;
            case enums_1.E_ErrorType.E_EMPLOYEE_NOT_FOUND:
                this.type = this.getEnumKeyByEnumValue(enums_1.E_ErrorType, this.err);
                ;
                this.message = enums_1.E_ErrorType.E_EMPLOYEE_NOT_FOUND;
                this.status = enums_1.HTTP_CODE.NOT_FOUND;
                break;
            case enums_1.E_ErrorType.E_EXPECTED_TOTAL_PRICE_NOT_MATCH:
                this.type = this.getEnumKeyByEnumValue(enums_1.E_ErrorType, this.err);
                this.message = enums_1.E_ErrorType.E_EXPECTED_TOTAL_PRICE_NOT_MATCH;
                this.status = enums_1.HTTP_CODE.BAD_REQUEST;
                break;
            case enums_1.E_ErrorType.E_PRODUCT_NOT_FOUND:
                this.type = enums_1.E_ErrorType.E_NOT_FOUND;
                this.message = enums_1.E_ErrorType.E_PRODUCT_NOT_FOUND;
                this.status = enums_1.HTTP_CODE.INTERNAL_SERVER_ERROR;
                break;
            case enums_1.E_ErrorType.E_USER_EXISTS:
                this.type = this.getEnumKeyByEnumValue(enums_1.E_ErrorType, this.err);
                this.message = enums_1.E_ErrorType.E_USER_EXISTS;
                this.status = enums_1.HTTP_CODE.INTERNAL_SERVER_ERROR;
                break;
            case enums_1.E_ErrorType.E_LOGIN_WRONG_PASSWORD:
                this.type = this.getEnumKeyByEnumValue(enums_1.E_ErrorType, this.err);
                this.message = enums_1.E_ErrorType.E_LOGIN_WRONG_PASSWORD;
                this.status = enums_1.HTTP_CODE.UNAUTHORIZED;
                break;
            case enums_1.E_ErrorType.E_LOGIN_WRONG_NIP:
                this.type = this.getEnumKeyByEnumValue(enums_1.E_ErrorType, this.err);
                this.message = enums_1.E_ErrorType.E_LOGIN_WRONG_NIP;
                this.status = enums_1.HTTP_CODE.UNAUTHORIZED;
                break;
            case enums_1.E_ErrorType.E_CUSTOMER_NOT_FOUND:
                this.type = this.getEnumKeyByEnumValue(enums_1.E_ErrorType, this.err);
                this.message = enums_1.E_ErrorType.E_CUSTOMER_NOT_FOUND;
                this.status = enums_1.HTTP_CODE.INTERNAL_SERVER_ERROR;
                break;
            case enums_1.E_ErrorType.E_VENDOR_NOT_FOUND:
                this.type = this.getEnumKeyByEnumValue(enums_1.E_ErrorType, this.err);
                this.message = enums_1.E_ErrorType.E_VENDOR_NOT_FOUND;
                this.status = enums_1.HTTP_CODE.INTERNAL_SERVER_ERROR;
                break;
            case enums_1.E_ErrorType.E_TOKEN_EXPIRED:
                this.type = this.getEnumKeyByEnumValue(enums_1.E_ErrorType, this.err);
                this.message = enums_1.E_ErrorType.E_TOKEN_EXPIRED;
                this.status = enums_1.HTTP_CODE.UNAUTHORIZED;
                break;
            default:
                switch (this.err.name) {
                    case 'QueryFailedError':
                        this.handleDatabaseError(this.err);
                        break;
                }
                break;
        }
    }
    handleDatabaseError(name) {
        switch (name.code) {
            case enums_1.E_ErrorType.ER_DUP_ENTRY:
                this.type = enums_1.E_ErrorType.ER_DUP_ENTRY;
                this.message = this.err.message;
                this.status = enums_1.HTTP_CODE.INTERNAL_SERVER_ERROR;
            default:
                this.type = enums_1.E_ErrorType.E_UNKNOWN_ERROR;
                this.message = this.err.message;
                this.status = enums_1.HTTP_CODE.INTERNAL_SERVER_ERROR;
                console.error(this.err.stack);
                break;
        }
    }
}
exports.ErrorHandler = ErrorHandler;
