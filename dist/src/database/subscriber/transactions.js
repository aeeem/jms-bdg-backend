"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.TransactionsSubscriber = void 0;
const transaction_1 = require("@entity/transaction");
const dayjs_1 = __importDefault(require("dayjs"));
const number_1 = require("src/helper/number");
const typeorm_1 = require("typeorm");
let TransactionsSubscriber = class TransactionsSubscriber {
    /**
       * Indicates that this subscriber only listen to StockGudang events.
       */
    listenTo() {
        return transaction_1.Transaction;
    }
    /**
       * Called after transaction commit.
       */
    afterTransactionCommit(event) {
        // console.log( 'AFTER TRANSACTION COMMITTED: ', event )
    }
    /**
       * Called before post insertion.
       */
    beforeInsert(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentMonth = (0, dayjs_1.default)().format('YYMM');
            const transactions = yield event.manager.query('select * from "transaction" t where extract(month from t.transaction_date) = extract(month from NOW()) and extract(year from t.transaction_date) = extract(year from now())');
            const padded = (0, number_1.padLeft)(transactions.length + 1, 6);
            const no_nota = `${currentMonth}${padded}`;
            event.entity.transaction_id = no_nota;
        });
    }
};
TransactionsSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)()
], TransactionsSubscriber);
exports.TransactionsSubscriber = TransactionsSubscriber;
