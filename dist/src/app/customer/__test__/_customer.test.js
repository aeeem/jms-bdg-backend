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
const errorTypes_1 = require("src/constants/errorTypes");
const testHelper_1 = require("src/helper/testHelper");
const testHelper_2 = require("src/testHelper");
const _customer_mock_1 = require("./_customer.mock");
let token = '';
describe('Customer module Tests', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        token = yield (0, testHelper_2.loginWithAdmin)();
    }));
    describe('Get All Customer Endpoint ', () => {
        it('[GET] /customer should return all customer', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield testHelper_1.makeRequest.get('/customer')
                .set({ authorization: token });
            const data = res.body.data;
            data.forEach((customer, index) => {
                expect(customer).toHaveProperty('id', _customer_mock_1.customerData[index].id);
                expect(customer).toHaveProperty('name', _customer_mock_1.customerData[index].name);
                expect(customer).toHaveProperty('contact_number', _customer_mock_1.customerData[index].contact_number);
                expect(customer).toHaveProperty('created_at');
                expect(customer).toHaveProperty('updated_at');
                expect(customer).toHaveProperty('transactions');
                expect(customer).toHaveProperty('monetary');
            });
            expect(res.body.stat_code).toBe(200);
        }));
    });
    describe(' Get Customer By Id Endpoint ', () => {
        describe('[-] Negative Test', () => {
            it('GET /customer/detail/:id with invalid id', () => __awaiter(void 0, void 0, void 0, function* () {
                yield testHelper_1.makeRequest.get('/customer/detail/100')
                    .set({ authorization: token })
                    .expect(200)
                    .then(res => {
                    (0, testHelper_2.shouldHaveError)(res.body.response, errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND);
                });
            }));
        });
        describe('[+] Positive Test', () => {
            it('GET /customer/detail/:id with valid id', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield testHelper_1.makeRequest.get(`/customer/detail/${_customer_mock_1.customerData[0].id}`)
                    .set({ authorization: token });
                const data = res.body.data;
                expect(data).toHaveProperty('id', _customer_mock_1.customerData[0].id);
                expect(data).toHaveProperty('name', _customer_mock_1.customerData[0].name);
                expect(data).toHaveProperty('contact_number', _customer_mock_1.customerData[0].contact_number);
                expect(data).toHaveProperty('created_at');
                expect(data).toHaveProperty('updated_at');
                expect(data).toHaveProperty('transactions');
                expect(data).toHaveProperty('monetary');
                expect(res.body.stat_code).toBe(200);
            }));
        });
    });
    describe(' Create Customer Endpoint ', () => {
        describe('[-] Negative Test', () => {
            it('POST /customer with invalid payload', () => __awaiter(void 0, void 0, void 0, function* () {
                yield testHelper_1.makeRequest.post('/customer')
                    .set({ authorization: token })
                    .send(_customer_mock_1.newCustomerMock)
                    .expect(422)
                    .then(res => {
                    expect(res.body).toHaveProperty('type', 'VALIDATION_ERROR');
                    expect(res.body).toHaveProperty('stat_msg', 'Validation Failed');
                    expect(res.body).toHaveProperty('stat_code', 422);
                    expect(res.body).toHaveProperty('details');
                    expect(res.body.details['payload.contact_number']).toHaveProperty('message', 'invalid string value');
                });
            }));
        });
        describe('[+] Positive Test', () => {
            it('POST /customer with valid payload', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield testHelper_1.makeRequest.post('/customer')
                    .set({ authorization: token })
                    .send(_customer_mock_1.validCustomerMock);
                const data = res.body.data;
                expect(data).toHaveProperty('id');
                expect(data).toHaveProperty('name', _customer_mock_1.validCustomerMock.name);
                expect(data).toHaveProperty('contact_number', _customer_mock_1.validCustomerMock.contact_number);
                expect(data).toHaveProperty('created_at');
                expect(data).toHaveProperty('updated_at');
                expect(res.body.stat_code).toBe(200);
            }));
        });
    });
    describe(' Get customer by ID Endpoint ', () => {
        describe('[-] Negative Test', () => {
            it('GET /customer/detail/:id with invalid id', () => __awaiter(void 0, void 0, void 0, function* () {
                yield testHelper_1.makeRequest.get('/customer/detail/100')
                    .set({ authorization: token })
                    .expect(200)
                    .then(res => {
                    (0, testHelper_2.shouldHaveError)(res.body.response, errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND);
                });
            }));
        });
        describe('[+] Positive Test', () => { });
    });
    describe(' Search customer by name', () => {
        describe('[-] Negative Test', () => { });
        describe('[+] Positive Test', () => { });
    });
    describe(' Update Customer Endpoint ', () => {
        describe('[-] Negative Test', () => { });
        describe('[+] Positive Test', () => { });
    });
    describe(' Delete Customer Endpoint ', () => {
        describe('[-] Negative Test', () => { });
        describe('[+] Positive Test', () => { });
    });
});
