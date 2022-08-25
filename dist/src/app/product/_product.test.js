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
const _database_1 = __importDefault(require("@database"));
// import initialSeeds from "../../database/seeds/seeder/initialSeeds";
const testHelper_1 = require("../../helper/testHelper");
describe('Product', () => {
    const db = new _database_1.default();
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.connectToDBTest();
        // await initialSeeds.productSeeder()
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.closeConnection();
    }));
    test('GET /api/products', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testHelper_1.makeRequest.get('/api/products')
            .expect(200)
            .then((res) => {
            expect(res).toBe(200);
        });
    }));
});
