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
const CustomerSeeder_1 = __importDefault(require("./CustomerSeeder"));
const RoleSeeder_1 = __importDefault(require("./RoleSeeder"));
const ScopeSeeder_1 = __importDefault(require("./ScopeSeeder"));
const UserSeeder_1 = __importDefault(require("./UserSeeder"));
const doSeeding = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // eslint-disable-next-line no-console
        console.log('Seeding data...');
        yield (0, ScopeSeeder_1.default)();
        yield (0, RoleSeeder_1.default)();
        yield (0, UserSeeder_1.default)();
        yield (0, CustomerSeeder_1.default)();
        console.log('Seeding data finished');
    }
    catch (error) {
        return error;
    }
});
exports.default = doSeeding;
