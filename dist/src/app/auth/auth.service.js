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
exports.registerUserService = exports.loginService = void 0;
const user_1 = require("@entity/user");
const enums_1 = require("src/constants/enums");
const errorTypes_1 = require("src/constants/errorTypes");
const languageEnums_1 = require("src/constants/languageEnums");
const errorHandler_1 = require("src/errorHandler");
const bcrypt_1 = require("src/helper/bcrypt");
const jwt_1 = require("src/helper/jwt");
const response_1 = __importDefault(require("src/helper/response"));
const scopeHelper_1 = require("src/helper/scopeHelper");
/**
 * It will return a token and user data if the user is found and the password is correct
 * @param {LoginRequestParameter} payload - LoginRequestParameter
 * @returns - token
 *   - id
 *   - noInduk
 *   - name
 *   - role
 */
const loginService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findOne({
            where: { noInduk: payload.noInduk },
            relations: ['role', 'role.scopes']
        });
        if (user == null)
            throw errorTypes_1.E_ERROR.LOGIN_WRONG_NIP;
        const isPasswordMatch = yield (0, bcrypt_1.compareHash)(payload.password, user.password);
        if (!isPasswordMatch)
            throw errorTypes_1.E_ERROR.LOGIN_WRONG_PASSWORD;
        const userScope = (0, scopeHelper_1.scopeFormatter)(user.role.scopes);
        const api_token = (0, jwt_1.createToken)({ id: user.id, noInduk: user.noInduk });
        return response_1.default.success({
            data: {
                token: api_token,
                id: user.id,
                noInduk: user.noInduk,
                name: user.name,
                role: user.role.role,
                scopes: userScope
            },
            stat_code: enums_1.HTTP_CODE.OK,
            stat_msg: languageEnums_1.SUCCESS_MESSAGE.LOGIN_SUCCESS
        });
    }
    catch (e) {
        return yield Promise.reject(new errorHandler_1.Errors(e));
    }
});
exports.loginService = loginService;
/**
 * It will register a new user to the database
 * @param {RegisterRequestParameter} payload - RegisterRequestParameter
 * @returns - User
 *   - Error
 */
const registerUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findOne({ where: { noInduk: payload.noInduk } });
        if (user != null)
            throw errorTypes_1.E_ERROR.USER_EXISTS;
        const hashedPassword = yield (0, bcrypt_1.createHashPassword)(payload.password);
        if (hashedPassword instanceof Error)
            throw hashedPassword;
        const newUser = new user_1.User();
        newUser.noInduk = payload.noInduk;
        newUser.name = payload.name;
        newUser.password = hashedPassword;
        yield newUser.save();
        return response_1.default.success({
            data: newUser,
            stat_code: enums_1.HTTP_CODE.OK,
            stat_msg: languageEnums_1.SUCCESS_MESSAGE.REGISTER_SUCCESS
        });
    }
    catch (e) {
        return yield Promise.reject(new errorHandler_1.Errors(e));
    }
});
exports.registerUserService = registerUserService;
