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
exports.TransactionProcessor = exports.formatTransaction = void 0;
const customerMonetary_1 = require("@entity/customerMonetary");
const transaction_1 = require("@entity/transaction");
const app_1 = require("src/app");
const errorTypes_1 = require("src/constants/errorTypes");
const hutangPiutang_1 = require("src/database/enum/hutangPiutang");
const transaction_2 = require("src/database/enum/transaction");
const AccountCode_1 = require("src/interface/AccountCode");
const formatTransaction = (transactions) => {
    return transactions.map(transaction => {
        return {
            id: transaction.id,
            expected_total_price: transaction.expected_total_price,
            actual_total_price: transaction.actual_total_price,
            amount_paid: transaction.amount_paid,
            change: transaction.change,
            outstanding_amount: transaction.outstanding_amount,
            transaction_date: transaction.transaction_date,
            customer: {
                id: transaction.customer.id,
                name: transaction.customer.name,
                contact_number: transaction.customer.contact_number
            },
            items: transaction.transactionDetails.map(detail => {
                return {
                    id: detail.id,
                    amount: detail.amount,
                    product: {
                        id: detail.product.id,
                        name: detail.product.name,
                        vendorId: detail.product.vendorId,
                        sku: detail.product.sku,
                        stock: {
                            id: detail.product.stocks[0].id,
                            total_stock: detail.product.stocks[0].stock_gudang,
                            sell_price: detail.product.stocks[0].sell_price,
                            buy_price: detail.product.stocks[0].buy_price
                        }
                    },
                    sub_total: detail.sub_total
                };
            }),
            status: transaction.status,
            created_at: transaction.created_at,
            updated_at: transaction.updated_at
        };
    });
};
exports.formatTransaction = formatTransaction;
class TransactionProcessor {
    constructor(payload, customer, transactionDetails, expected_total_price, total_deposit) {
        this.transaction_details = [];
        this.queryRunner = app_1.db.queryRunner();
        this.total_deposit = 0;
        this.payWithCash = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // process transaction
                const hasChange = this.payload.amount_paid >= this.payload.actual_total_price;
                this.change = hasChange ? this.payload.amount_paid - this.payload.actual_total_price : 0;
                // [7] customer bayar dengan cash dan ada kembalian dan kembalian dijadikan deposit
                if (hasChange && this.payload.deposit) {
                    return yield this.makeDeposit(this.change);
                }
                // [8] customer bayar dengan cash namun dana tidak cukup
                if (this.payload.amount_paid <= this.payload.actual_total_price) {
                    return yield this.makeDebt(this.payload.actual_total_price - this.payload.amount_paid);
                }
            }
            catch (error) {
                return yield Promise.reject(error);
            }
        });
        this.payWithDeposit = () => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.payload.amount_paid) {
                    return yield this.payWithDepositAndCash();
                }
                // [2] customer bayar dengan deposit dan deposit cukup untuk membayar
                if (this.total_deposit >= this.payload.actual_total_price) {
                    return yield this.subDeposit(this.payload.actual_total_price);
                }
                // [5] customer bayar dengan deposit namun dana tidak cukup dan sisa bayar jadi hutang
                if (this.total_deposit <= this.payload.actual_total_price) {
                    yield this.subDeposit(this.total_deposit);
                    return yield this.makeDebt(this.payload.actual_total_price - this.total_deposit);
                }
            }
            catch (error) {
                return yield Promise.reject(error);
            }
        });
        this.payWithDepositAndCash = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // [3] check apakah deposit cukup untuk membayar jika iya, check apakah ada kembalian,
                // jika ya check apakah customer ingin menjadikan deposit atau kembalian
                if (this.payload.amount_paid + this.total_deposit > this.payload.actual_total_price && this.payload.deposit) {
                    yield this.subDeposit(this.total_deposit);
                    return yield this.makeDeposit(this.payload.deposit);
                }
                // [4] amount_paid + total_deposit < actual_price ==> customer bayar dengan deposit dan uang tunai namun dana tidak cukup
                if (this.payload.amount_paid + this.total_deposit < this.payload.actual_total_price) {
                    const debtAmt = this.payload.actual_total_price - (this.payload.amount_paid + this.total_deposit);
                    yield this.makeDebt(debtAmt);
                    return yield this.subDeposit(this.total_deposit);
                }
                return yield this.subDeposit(this.total_deposit);
            }
            catch (error) {
                return yield Promise.reject(error);
            }
        });
        this.processTransaction = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.transaction.customer = this.customer;
                this.transaction.transactionDetails = this.transaction_details;
                this.transaction.expected_total_price = this.expected_total_price;
                this.transaction.actual_total_price = this.payload.actual_total_price;
                this.transaction.transaction_date = this.payload.transaction_date;
                this.transaction.amount_paid = this.payload.amount_paid;
                this.transaction.status = transaction_2.E_TransactionStatus.FINISHED;
                this.transaction.change = this.change || 0;
                yield this.queryRunner.manager.save(this.transaction);
                return;
            }
            catch (error) {
                return yield Promise.reject(error);
            }
        });
        this.makeDebt = (amount) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customerMonet = new customerMonetary_1.CustomerMonetary();
                customerMonet.customer = this.customer;
                customerMonet.amount = amount;
                customerMonet.type = hutangPiutang_1.E_Recievables.DEBT;
                customerMonet.transaction_id = this.transaction.id;
                customerMonet.source = AccountCode_1.E_CODE_KEY.DEBT_ADD_INSUFFICIENT_FUND;
                yield this.queryRunner.manager.save(customerMonet);
                this.transaction_status = transaction_2.E_TransactionStatus.PENDING;
            }
            catch (error) {
                return yield Promise.reject(error);
            }
        });
        this.makeDeposit = (amount) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customerMonet = new customerMonetary_1.CustomerMonetary();
                customerMonet.customer = this.customer;
                customerMonet.amount = amount;
                customerMonet.type = hutangPiutang_1.E_Recievables.DEPOSIT;
                customerMonet.transaction_id = this.transaction.id;
                customerMonet.source = AccountCode_1.E_CODE_KEY.DEP_ADD_TRANSACTION_CHANGE;
                yield this.queryRunner.manager.save(customerMonet);
                this.transaction_status = transaction_2.E_TransactionStatus.FINISHED;
            }
            catch (error) {
                return yield Promise.reject(error);
            }
        });
        this.subDeposit = (amount) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customerMonet = new customerMonetary_1.CustomerMonetary();
                customerMonet.customer = this.customer;
                customerMonet.amount = amount;
                customerMonet.type = hutangPiutang_1.E_Recievables.DEPOSIT;
                customerMonet.transaction_id = this.transaction.id;
                customerMonet.source = AccountCode_1.E_CODE_KEY.DEP_SUB_PAID_WITH_DEPOSIT;
                yield this.queryRunner.manager.save(customerMonet);
                this.transaction_status = transaction_2.E_TransactionStatus.FINISHED;
            }
            catch (error) {
                return yield Promise.reject(error);
            }
        });
        this.payload = payload;
        this.customer = customer;
        this.transaction_details = transactionDetails;
        this.expected_total_price = expected_total_price;
        this.total_deposit = total_deposit;
        this.transaction = new transaction_1.Transaction();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.processTransaction();
                if (this.payload.use_deposit) {
                    if (!this.total_deposit)
                        throw errorTypes_1.E_ERROR.CUSTOMER_NO_DEPOSIT;
                    return yield this.payWithDeposit();
                }
                else {
                    return yield this.payWithCash();
                }
            }
            catch (error) {
                return yield Promise.reject(error);
            }
        });
    }
}
exports.TransactionProcessor = TransactionProcessor;
