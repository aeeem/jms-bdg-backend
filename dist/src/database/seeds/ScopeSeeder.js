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
const scopes_1 = require("@entity/scopes");
const app_1 = require("src/app");
const scopeSeeds = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // eslint-disable-next-line no-console
        console.info('Seeding Scope data');
        const scopes = {
            // customer
            create_customer: true,
            read_customer: true,
            update_customer: true,
            delete_customer: true,
            // product
            create_product: true,
            read_product: true,
            update_product: true,
            delete_product: true,
            // pegawai
            create_pegawai: true,
            read_pegawai: true,
            update_pegawai: true,
            delete_pegawai: true,
            // role
            create_role: true,
            read_role: true,
            update_role: true,
            delete_role: true,
            // scope
            create_scope: true,
            read_scope: true,
            update_scope: true,
            delete_scope: true,
            // user
            create_user: true,
            read_user: true,
            update_user: true,
            delete_user: true,
            // transaction
            create_transaction: true,
            read_transaction: true,
            update_transaction: true,
            delete_transaction: true,
            // stock
            create_stock: true,
            read_stock: true,
            update_stock: true,
            delete_stock: true,
            // vendor
            create_vendor: true,
            read_vendor: true,
            update_vendor: true,
            delete_vendor: true
        };
        yield app_1.db.getConnection().getRepository(scopes_1.Scope)
            .insert(scopes);
    }
    catch (error) {
        return error.message;
    }
});
exports.default = scopeSeeds;
