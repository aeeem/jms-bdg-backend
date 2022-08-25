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
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({});
class Database {
    connectToDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, typeorm_1.createConnection)({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: process.env.DEV_DATABASE_USERNAME,
                password: process.env.DEV_DATABASE_PASSWORD,
                database: process.env.DEV_DATABASE_NAME,
                entities: [
                    __dirname + "/entity/*.ts",
                    __dirname + "/entity/*.js"
                ],
                logging: false,
                synchronize: true
            }).then(_con => {
                this.connection = _con;
                console.log("Connected to db!!");
            }).catch(console.error);
        });
    }
    connectToDBTest() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, typeorm_1.createConnection)({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: process.env.TEST_DATABASE_USERNAME,
                password: process.env.TEST_DATABASE_PASSWORD,
                database: process.env.TEST_DATABASE_NAME,
                entities: [
                    __dirname + "/entity/*.ts",
                    __dirname + "/entity/*.js"
                ],
                dropSchema: true,
                synchronize: true,
                logging: false
            }).then(_con => {
                this.connection = _con;
                console.log("Connected to db!!");
            }).catch(console.error);
        });
    }
    getConnection() {
        return this.connection;
    }
    closeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.close();
        });
    }
}
exports.default = Database;
function envString(prodString, devString) {
    return process.env.NODE_ENV === 'production' ? prodString : devString;
}
