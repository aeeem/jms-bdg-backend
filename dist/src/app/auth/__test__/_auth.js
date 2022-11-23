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
// import initialSeeds from "../../database/seeds/seeder/initialSeeds";
const errorTypes_1 = require("src/constants/errorTypes");
const languageEnums_1 = require("src/constants/languageEnums");
const testHelper_1 = require("src/testHelper");
const testHelper_2 = require("../../../helper/testHelper");
const _auth_mock_1 = require("./_auth.mock");
describe('Auth modul tests', () => {
    describe('Login Endpoint', () => {
        describe('[-] Negative Test', () => {
            it('POST /login with empty payload', () => __awaiter(void 0, void 0, void 0, function* () {
                yield testHelper_2.makeRequest.post('/auth/login')
                    .send(_auth_mock_1.LoginPayloadMock.emptyNipAndPassword)
                    .expect(200)
                    .then(res => {
                    (0, testHelper_1.shouldHaveError)(res.body.response, errorTypes_1.E_ERROR.NIP_AND_PASSWORD_REQUIRED);
                });
            }));
            it('POST /login with wrong noInduk', () => __awaiter(void 0, void 0, void 0, function* () {
                yield testHelper_2.makeRequest.post('/auth/login')
                    .send(_auth_mock_1.LoginPayloadMock.wrongNip)
                    .expect(200)
                    .then(res => {
                    (0, testHelper_1.shouldHaveError)(res.body.response, errorTypes_1.E_ERROR.LOGIN_WRONG_NIP);
                });
            }));
            it('POST /login with wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
                yield testHelper_2.makeRequest.post('/auth/login')
                    .send(_auth_mock_1.LoginPayloadMock.wrongPassword)
                    .expect(200)
                    .then(res => {
                    (0, testHelper_1.shouldHaveError)(res.body.response, errorTypes_1.E_ERROR.LOGIN_WRONG_PASSWORD);
                });
            }));
        });
        describe('[+] Positive Test', () => {
            it('POST /login with super admin user', () => __awaiter(void 0, void 0, void 0, function* () {
                yield testHelper_2.makeRequest.post('/auth/login')
                    .send(_auth_mock_1.LoginPayloadMock.superAdmin)
                    .expect(200)
                    .then(({ body: response }) => {
                    expect(response).toHaveProperty('data');
                    expect(response).toHaveProperty('stat_code');
                    expect(response).toHaveProperty('stat_msg');
                    expect(response.stat_msg).toBe(languageEnums_1.SUCCESS_MESSAGE.LOGIN_SUCCESS);
                });
            }));
        });
    });
    describe('Register user', () => {
        describe('[-] Negative Test', () => {
            it('POST /register with empty payload', () => __awaiter(void 0, void 0, void 0, function* () {
                yield testHelper_2.makeRequest.post('/auth/register')
                    .send(_auth_mock_1.RegisterPayloadMock.emptyStringsValidation)
                    .expect(200)
                    .then(res => {
                    (0, testHelper_1.shouldHaveError)(res.body.response, errorTypes_1.E_ERROR.REGISTER_INVALID_PAYLOAD);
                });
            }));
            it('POST /register with Existing user (super admin)', () => __awaiter(void 0, void 0, void 0, function* () {
                yield testHelper_2.makeRequest.post('/auth/register')
                    .send(_auth_mock_1.RegisterPayloadMock.existingUser)
                    .expect(200)
                    .then(res => {
                    (0, testHelper_1.shouldHaveError)(res.body.response, errorTypes_1.E_ERROR.USER_EXISTS);
                });
            }));
        });
        describe('[+] Positive Test', () => {
            it('POST /register with new user', () => __awaiter(void 0, void 0, void 0, function* () {
                yield testHelper_2.makeRequest.post('/auth/register')
                    .send(_auth_mock_1.RegisterPayloadMock.newRandomUser)
                    .expect(200)
                    .then(({ body }) => {
                    expect(body).toHaveProperty('stat_code', 200);
                    expect(body).toHaveProperty('stat_msg', languageEnums_1.SUCCESS_MESSAGE.REGISTER_SUCCESS);
                    // check payload
                    expect(body.data).toHaveProperty('noInduk', _auth_mock_1.RegisterPayloadMock.newRandomUser.noInduk);
                    expect(body.data).toHaveProperty('name', _auth_mock_1.RegisterPayloadMock.newRandomUser.name);
                    expect(body.data).toHaveProperty('role_id', null);
                });
            }));
        });
    });
});
