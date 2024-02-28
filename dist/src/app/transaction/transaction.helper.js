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
exports.TransactionProcessor = exports.formatTransaction = exports.restoreStocks = void 0;
const customerMonetary_1 = require("@entity/customerMonetary");
const stock_1 = require("@entity/stock");
const stockToko_1 = require("@entity/stockToko");
const transaction_1 = require("@entity/transaction");
const app_1 = require("src/app");
const errorTypes_1 = require("src/constants/errorTypes");
const hutangPiutang_1 = require("src/database/enum/hutangPiutang");
const transaction_2 = require("src/database/enum/transaction");
const AccountCode_1 = require("src/interface/AccountCode");
const StocksCode_1 = require("src/interface/StocksCode");
const customer_service_1 = require("../customer/customer.service");
const restoreStocks = (items) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = app_1.db.queryRunner();
    try {
        yield queryRunner.startTransaction();
        for (const item of items) {
            const stockItem = yield stock_1.Stock.findOneOrFail(item.stock_id, { relations: ['product'] });
            stockItem.stock_toko += item.amount;
            const stockToko = new stockToko_1.StockToko();
            stockToko.amount = item.amount;
            stockToko.code = StocksCode_1.E_TOKO_CODE_KEY.TOK_ADD_BRG_PENDING_TRANSAKSI;
            stockToko.stock_id = item.stock_id;
            yield queryRunner.manager.save(stockItem);
            yield queryRunner.manager.save(stockToko);
            yield queryRunner.manager.softRemove(item);
        }
        yield queryRunner.commitTransaction();
    }
    catch (error) {
        yield Promise.reject(error);
        yield queryRunner.rollbackTransaction();
    }
    finally {
        yield queryRunner.release();
    }
});
exports.restoreStocks = restoreStocks;
const formatTransaction = (transactions) => {
    return transactions.map(transaction => {
        var _a, _b, _c, _d, _e, _f;
        return {
            id: transaction.id,
            expected_total_price: transaction.expected_total_price,
            actual_total_price: transaction.actual_total_price,
            amount_paid: transaction.amount_paid,
            change: transaction.change,
            outstanding_amount: transaction.outstanding_amount,
            transaction_date: transaction.transaction_date,
            deposit: transaction.deposit,
            customer: {
                id: (_a = transaction.customer) === null || _a === void 0 ? void 0 : _a.id,
                name: (_b = transaction.customer) === null || _b === void 0 ? void 0 : _b.name,
                contact_number: (_c = transaction.customer) === null || _c === void 0 ? void 0 : _c.contact_number
            },
            packaging_cost: transaction.packaging_cost,
            description: transaction.description,
            optional_discount: transaction.optional_discount,
            cashier: {
                id: (_d = transaction.cashier) === null || _d === void 0 ? void 0 : _d.id,
                name: (_e = transaction.cashier) === null || _e === void 0 ? void 0 : _e.name,
                noInduk: (_f = transaction.cashier) === null || _f === void 0 ? void 0 : _f.noInduk
            },
            items: transaction.transactionDetails.map(detail => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                return {
                    id: detail.id,
                    amount: detail.amount,
                    product: {
                        id: ((_b = (_a = detail.stock) === null || _a === void 0 ? void 0 : _a.product) === null || _b === void 0 ? void 0 : _b.id) || null,
                        stockId: detail.stock.id,
                        name: ((_d = (_c = detail.stock) === null || _c === void 0 ? void 0 : _c.product) === null || _d === void 0 ? void 0 : _d.name) || '',
                        vendorId: ((_f = (_e = detail.stock) === null || _e === void 0 ? void 0 : _e.product) === null || _f === void 0 ? void 0 : _f.vendorId) || null,
                        vendorName: (_j = (_h = (_g = detail.stock) === null || _g === void 0 ? void 0 : _g.product) === null || _h === void 0 ? void 0 : _h.vendor.name) !== null && _j !== void 0 ? _j : '',
                        sku: ((_l = (_k = detail.stock) === null || _k === void 0 ? void 0 : _k.product) === null || _l === void 0 ? void 0 : _l.sku) || '',
                        stock_toko: detail.stock.stock_toko,
                        stock_gudang: detail.stock.stock_gudang,
                        sell_price: detail.stock.sell_price,
                        buy_price: detail.stock.buy_price,
                        box: detail.is_box,
                        weight: detail.stock.weight
                    },
                    sub_total: detail.sub_total
                };
            }),
            status: transaction.status,
            is_transfer: transaction.is_transfer,
            created_at: transaction.created_at,
            updated_at: transaction.updated_at,
            transaction_id: transaction.transaction_id,
            remaining_deposit: transaction.remaining_deposit,
            usage_deposit: transaction.usage_deposit,
            pay_debt_amount: transaction.pay_debt_amount,
            sub_total: transaction.sub_total
        };
    });
};
exports.formatTransaction = formatTransaction;
class TransactionProcessor {
    constructor(payload, customer, transactionDetails, expected_total_price, total_deposit, isPending, pay_debt = false, queryRunner, user) {
        this.transaction_details = [];
        this.total_deposit = 0;
        this.calculateTotalPrice = () => {
            let totalPrice = this.payload.actual_total_price;
            // check if there is discount
            if (this.payload.optional_discount) {
                totalPrice -= this.payload.optional_discount;
            }
            // check if there is packaging cost added
            if (this.payload.packaging_cost) {
                totalPrice += this.payload.packaging_cost;
            }
            this.calculated_price = totalPrice;
        };
        this.payWithCash = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // process transaction
                const hasChange = this.payload.amount_paid > this.calculated_price;
                const change = hasChange ? this.payload.amount_paid - this.calculated_price : 0;
                this.change = change;
                // [7] customer bayar dengan cash dan ada kembalian dan kembalian dijadikan deposit
                if (hasChange && this.payload.deposit) {
                    return yield this.makeDeposit(change);
                }
                // [9] customer bayar hutang dengan kembalian tanpa menjadikan deposit
                if (hasChange && this.pay_debt) {
                    return yield this.subDebt();
                }
                // [8] customer bayar dengan cash namun dana tidak cukup
                if (this.payload.amount_paid < this.calculated_price) {
                    return yield this.makeDebt(this.calculated_price - this.payload.amount_paid);
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
                if (this.total_deposit >= this.calculated_price) {
                    return yield this.subDeposit(this.calculated_price);
                }
                // [5] customer bayar dengan deposit namun dana tidak cukup dan sisa bayar jadi hutang
                if (this.total_deposit <= this.calculated_price) {
                    yield this.subDeposit(this.total_deposit);
                    return yield this.makeDebt(this.calculated_price - this.total_deposit);
                }
            }
            catch (error) {
                return yield Promise.reject(error);
            }
        });
        this.payWithDepositAndCash = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const currentPaid = this.payload.amount_paid + this.total_deposit;
                // [3] check apakah deposit cukup untuk membayar jika iya, check apakah ada kembalian,
                // jika ya check apakah customer ingin menjadikan deposit atau kembalian
                if (currentPaid > this.calculated_price && this.payload.deposit) {
                    yield this.subDeposit(this.total_deposit);
                    return yield this.makeDeposit(this.payload.deposit);
                }
                // [4] amount_paid + total_deposit < actual_price ==> customer bayar dengan deposit dan uang tunai namun dana tidak cukup
                if (currentPaid < this.calculated_price) {
                    const debtAmt = this.calculated_price - (currentPaid);
                    yield this.makeDebt(debtAmt);
                    return yield this.subDeposit(this.total_deposit);
                }
                if (currentPaid > this.calculated_price && !this.payload.deposit) {
                    this.change = currentPaid - this.calculated_price;
                }
                return yield this.subDeposit(this.total_deposit);
            }
            catch (error) {
                return yield Promise.reject(error);
            }
        });
        this.processTransaction = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                this.transaction.customer = this.customer;
                this.transaction.transactionDetails = this.transaction_details;
                this.transaction.expected_total_price = this.expected_total_price;
                this.transaction.actual_total_price = this.calculated_price;
                this.transaction.transaction_date = this.payload.transaction_date;
                this.transaction.amount_paid = this.payload.amount_paid;
                this.transaction.status = this.isPending ? transaction_2.E_TransactionStatus.PENDING : transaction_2.E_TransactionStatus.FINISHED;
                this.transaction.change = this.change || 0;
                this.transaction.description = this.payload.description;
                this.transaction.optional_discount = this.payload.optional_discount;
                this.transaction.packaging_cost = (_a = this.payload.packaging_cost) !== null && _a !== void 0 ? _a : 0;
                this.transaction.cashier = this.user;
                this.transaction.deposit = this.payload.deposit;
                this.transaction.is_transfer = this.payload.is_transfer;
                this.transaction.sub_total = this.payload.sub_total;
                if (this.payload.amount_paid < this.calculated_price) {
                    this.transaction.outstanding_amount = this.calculated_price - this.payload.amount_paid;
                }
                if (this.payload.use_deposit) {
                    this.transaction.usage_deposit = this.total_deposit <= this.transaction.actual_total_price ? this.total_deposit : this.transaction.actual_total_price;
                    this.transaction.remaining_deposit = Number(this.payload.deposit) + Number(this.remainingDeposit);
                    // TODO temporary, needed proper code
                    const is_debt = this.payload.amount_paid + this.total_deposit < this.calculated_price;
                    this.transaction.outstanding_amount = is_debt ? this.calculated_price - (this.payload.amount_paid + this.total_deposit) : 0;
                }
                if (this.pay_debt) {
                    this.transaction.pay_debt_amount = this.pay_debt_amount;
                }
                yield this.queryRunner.manager.save(this.transaction);
                return;
            }
            catch (error) {
                return yield Promise.reject(error);
            }
        });
        this.makeDebt = (amount) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.customer)
                    throw errorTypes_1.E_ERROR.CANT_MAKE_DEBT_FOR_UNREGISTERED_CUSTOMER;
                const customerMonet = new customerMonetary_1.CustomerMonetary();
                customerMonet.customer = this.customer;
                customerMonet.amount = this.payload.optional_discount ? amount - this.payload.optional_discount : amount;
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
            var _b, _c;
            try {
                const customerMonet = new customerMonetary_1.CustomerMonetary();
                let remainingMoney = 0;
                if (this.pay_debt) {
                    if (!this.customer)
                        throw errorTypes_1.E_ERROR.CANT_PAY_DEBT_FOR_UNREGISERED_CUSTOMER;
                    const { total_debt } = yield (0, customer_service_1.getCustomerDebtService)(this.customer.id);
                    // tidak bisa melakukan bayar hutang + deposit jika dia masih memiliki hutang setelah bayar dengan kembalian
                    if (total_debt - this.change > 0)
                        throw errorTypes_1.E_ERROR.CHANGE_INSUFFICIENT_TO_PAY_DEBT_AND_MAKE_DEPOSIT;
                    const payDebtMonet = new customerMonetary_1.CustomerMonetary();
                    remainingMoney = this.change - total_debt;
                    payDebtMonet.customer = this.customer;
                    payDebtMonet.amount = remainingMoney;
                    payDebtMonet.type = hutangPiutang_1.E_Recievables.DEBT;
                    payDebtMonet.transaction_id = this.transaction.id;
                    payDebtMonet.source = AccountCode_1.E_CODE_KEY.DEBT_SUB_PAY_WITH_CHANGE;
                    yield this.queryRunner.manager.save(payDebtMonet);
                }
                customerMonet.customer = this.customer;
                customerMonet.amount = this.pay_debt ? remainingMoney : Number((_b = this.payload.deposit) !== null && _b !== void 0 ? _b : 0);
                customerMonet.type = hutangPiutang_1.E_Recievables.DEPOSIT;
                customerMonet.transaction_id = this.transaction.id;
                customerMonet.source = AccountCode_1.E_CODE_KEY.DEP_ADD_TRANSACTION_CHANGE;
                this.transaction_status = transaction_2.E_TransactionStatus.FINISHED;
                yield this.queryRunner.manager.save(customerMonet);
                this.change = amount - Number((_c = this.payload.deposit) !== null && _c !== void 0 ? _c : 0);
            }
            catch (error) {
                return yield Promise.reject(error);
            }
        });
        this.subDebt = () => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.change < 1)
                    throw errorTypes_1.E_ERROR.CHANGE_INSUFFICIENT_TO_PAY_DEBT_AND_MAKE_DEPOSIT;
                if (this.customer) {
                    const customerMonet = new customerMonetary_1.CustomerMonetary();
                    const { total_debt } = yield (0, customer_service_1.getCustomerDebtService)(this.customer.id);
                    const pay_debt = (total_debt - this.change) < 0 ? total_debt : this.change;
                    customerMonet.customer = this.customer;
                    customerMonet.amount = pay_debt;
                    customerMonet.type = hutangPiutang_1.E_Recievables.DEBT;
                    customerMonet.transaction_id = this.transaction.id;
                    customerMonet.source = AccountCode_1.E_CODE_KEY.DEBT_SUB_PAY_WITH_CASH;
                    yield this.queryRunner.manager.save(customerMonet);
                    this.transaction_status = transaction_2.E_TransactionStatus.FINISHED;
                    this.pay_debt_amount = pay_debt;
                    this.change = this.change - pay_debt;
                }
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
                this.remainingDeposit = this.total_deposit - amount;
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
        this.isPending = isPending;
        this.user = user;
        this.pay_debt = pay_debt;
        this.calculateTotalPrice();
        this.queryRunner = queryRunner;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.payload.use_deposit && this.customer && !this.isPending) {
                    if (!this.total_deposit)
                        throw errorTypes_1.E_ERROR.CUSTOMER_NO_DEPOSIT;
                    yield this.payWithDeposit();
                }
                else if (!this.isPending) {
                    yield this.payWithCash();
                }
                return yield this.processTransaction();
            }
            catch (error) {
                return yield Promise.reject(error);
            }
        });
    }
}
exports.TransactionProcessor = TransactionProcessor;
