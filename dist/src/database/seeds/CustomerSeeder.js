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
const customer_1 = require("@entity/customer");
const app_1 = require("src/app");
const customerSeeds = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // eslint-disable-next-line no-console
        console.info('Seeding customer data');
        const customer = [
            {
                name: 'Customer 1',
                contact_number: '001'
            },
            {
                name: 'Customer 2',
                contact_number: '002'
            },
            {
                name: 'Customer 3',
                contact_number: '003'
            }
        ];
        yield app_1.db.getConnection().getRepository(customer_1.Customer)
            .insert(customer);
    }
    catch (error) {
        return error.message;
    }
});
exports.default = customerSeeds;
