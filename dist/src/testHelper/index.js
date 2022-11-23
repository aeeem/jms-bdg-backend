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
exports.loginWithAdmin = exports.shouldHaveSuccessResponse = exports.shouldHaveError = void 0;
const _auth_mock_1 = require("src/app/auth/__test__/_auth.mock");
const errorHandler_1 = require("src/errorHandler");
const testHelper_1 = require("src/helper/testHelper");
const shouldHaveError = (response, expectedError) => {
    const { response: err } = new errorHandler_1.Errors(expectedError);
    expect(response.type).toBe(err.type);
    expect(response.stat_msg).toBe(err.stat_msg);
    expect(response.stat_code).toBe(err.stat_code);
};
exports.shouldHaveError = shouldHaveError;
const shouldHaveSuccessResponse = (response, expectedResponse) => {
    expect(response.stat_code).toBe(expectedResponse.stat_code);
    expect(response.stat_msg).toBe(expectedResponse.stat_msg);
};
exports.shouldHaveSuccessResponse = shouldHaveSuccessResponse;
const loginWithAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield testHelper_1.makeRequest.post('/auth/login')
            .send(_auth_mock_1.LoginPayloadMock.superAdmin)
            .then(res => {
            return res.body.data.token;
        });
        return response;
    }
    catch (error) {
        return error;
    }
});
exports.loginWithAdmin = loginWithAdmin;
