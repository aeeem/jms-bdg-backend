"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransactionService = exports.getTransactionByIdService = exports.updateTransactionService = exports.searchTransactionService = exports.deletePendingTransactionItemService = exports.deletePendingTransactionService = exports.updatePendingTransactionService = exports.createTransactionService = exports.getAllTransactionService = void 0;
const Sentry = __importStar(require("@sentry/node"));
const cashFlow_1 = require("@entity/cashFlow");
const customer_1 = require("@entity/customer");
const customerMonetary_1 = require("@entity/customerMonetary");
const stock_1 = require("@entity/stock");
const stockToko_1 = require("@entity/stockToko");
const transaction_1 = require("@entity/transaction");
const transactionDetail_1 = require("@entity/transactionDetail");
const lodash_1 = __importDefault(require("lodash"));
const app_1 = require("src/app");
const errorTypes_1 = require("src/constants/errorTypes");
const languageEnums_1 = require("src/constants/languageEnums");
const cashFlow_2 = require("src/database/enum/cashFlow");
const hutangPiutang_1 = require("src/database/enum/hutangPiutang");
const transaction_2 = require("src/database/enum/transaction");
const errorHandler_1 = require("src/errorHandler");
const stockHelper_1 = require("src/helper/stockHelper");
const StocksCode_1 = require("src/interface/StocksCode");
const customer_service_1 = require("../customer/customer.service");
const transaction_helper_1 = require("./transaction.helper");
const stockGudang_1 = require("@entity/stockGudang");
const getAllTransactionService = async (sort = 'DESC') => {
    try {
        const order = sort;
        const transactions = await transaction_1.Transaction.find({
            withDeleted: true,
            order: { updated_at: order },
            where: { status: transaction_2.E_TransactionStatus.FINISHED },
            relations: [
                'customer',
                'cashier',
                'transactionDetails',
                'transactionDetails.stock',
                'transactionDetails.stock.product',
                'transactionDetails.stock.product.vendor'
            ]
        });
        return (0, transaction_helper_1.formatTransaction)(transactions);
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.getAllTransactionService = getAllTransactionService;
const createTransactionService = async (payload, isPending = false, user) => {
    const queryRunner = app_1.db.queryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const customer = await queryRunner.manager.findOne(customer_1.Customer, { where: { id: payload.customer_id } });
        const customerDeposit = customer
            ? (await (0, customer_service_1.getCustomerDepositService)(customer.id)).total_deposit
            : 0;
        // getCustomerDebtService with condition is_pay_debt
        const stocks = await queryRunner.manager.find(stock_1.Stock, { relations: ['product', 'product.vendor'] });
        const expected_total_price = 0;
        const transactionDetails = payload.detail.map(transactionDetail => {
            const stock = stocks.find(product => product.id === transactionDetail.stock_id);
            if (stock == null)
                throw errorTypes_1.E_ERROR.PRODUCT_NOT_FOUND;
            const detail = new transactionDetail_1.TransactionDetail();
            detail.amount = transactionDetail.amount;
            detail.sub_total = transactionDetail.sub_total;
            detail.stock_id = transactionDetail.stock_id;
            detail.stock = stock;
            detail.is_box = transactionDetail.box;
            return detail;
        });
        const stockSync = await Promise.all(payload.detail.map(async (detail) => {
            let isPendingUpdate = false;
            let existStock = 0;
            if (payload.id_transaction) {
                const transactionDetail = await transactionDetail_1.TransactionDetail.find({
                    where: { transaction_id: payload.id_transaction },
                    relations: ['stock']
                });
                if (!transactionDetail)
                    throw errorTypes_1.E_ERROR.TRANSACTION_NOT_FOUND;
                const findTransactionDetail = transactionDetail.find(item => item.stock_id === detail.stock_id);
                if (findTransactionDetail) {
                    isPendingUpdate = true;
                    existStock = findTransactionDetail.amount;
                }
            }
            const stockHelper = await (0, stockHelper_1.stockDeductor)(detail.stock_id, detail.amount, detail.box, isPendingUpdate, existStock);
            await queryRunner.manager.save(stockHelper.entity);
            return stockHelper.stock;
        }));
        // passing customer debt here
        const transactionProcess = new transaction_helper_1.TransactionProcessor(payload, customer, transactionDetails, expected_total_price, customerDeposit, isPending, payload.pay_debt, queryRunner, user);
        await transactionProcess.start();
        if (payload.amount_paid) {
            const cashFlow = new cashFlow_1.CashFlow();
            cashFlow.amount =
                payload.amount_paid < payload.actual_total_price
                    ? payload.amount_paid
                    : payload.actual_total_price;
            cashFlow.code = cashFlow_2.E_CashFlowCode.IN_TRANSACTION;
            cashFlow.transaction_id = transactionProcess.transaction.id;
            cashFlow.type = cashFlow_2.E_CashFlowType.CashIn;
            cashFlow.cash_type = payload.is_transfer
                ? cashFlow_2.E_CashType.TRANSFER
                : cashFlow_2.E_CashType.CASH;
            if (payload.customer_id) {
                cashFlow.customer_id = payload.customer_id;
            }
            cashFlow.note =
                'Penjualan produk' + `${payload.pay_debt ? ' & Bayar Kasbon' : ''}`; // temporary harcode
            await queryRunner.manager.save(cashFlow);
        }
        await queryRunner.manager.save(stockSync);
        await queryRunner.commitTransaction();
        return {
            transaction: (0, transaction_helper_1.formatTransaction)([transactionProcess.transaction]),
            customer: {
                ...transactionProcess.transaction.customer,
                deposit_balance: transactionProcess.transaction.customer
                    ? (await (0, customer_service_1.getCustomerDepositService)(transactionProcess.transaction?.customer?.id)).total_deposit
                    : 0,
                debt_balance: transactionProcess.transaction.customer
                    ? (await (0, customer_service_1.getCustomerDebtService)(transactionProcess.transaction?.customer?.id)).total_debt
                    : 0
            }
        };
    }
    catch (error) {
        Sentry.captureException(error);
        await queryRunner.rollbackTransaction();
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        await queryRunner.release();
    }
};
exports.createTransactionService = createTransactionService;
const updatePendingTransactionService = async (transaction_id, items) => {
    const queryRunner = app_1.db.queryRunner();
    try {
        await queryRunner.startTransaction();
        const transaction = await transaction_1.Transaction.findOne({
            where: { id: transaction_id },
            relations: ['transactionDetails', 'transactionDetails.stock']
        });
        if (!transaction)
            throw errorTypes_1.E_ERROR.TRANSACTION_NOT_FOUND;
        const transactionDetailsIds = transaction.transactionDetails.map(detail => detail.stock_id);
        const payloadStockIds = items.map(item => item.stock_id);
        const updateData = await Promise.all(transaction.transactionDetails
            .filter(detail => payloadStockIds.includes(detail.stock_id))
            .map(async (transactionDetail) => {
            const masterStock = await stock_1.Stock.findOneOrFail(transactionDetail.stock_id);
            const payload = items.find(item => item.stock_id === transactionDetail.stock_id);
            const stockToko = new stockToko_1.StockToko();
            const stockGudang = new stockGudang_1.StockGudang();
            if (!payload)
                throw errorTypes_1.E_ERROR.STOCK_NOT_FOUND;
            if (Number(payload.amount) === Number(transactionDetail.amount)) {
                return transactionDetail;
            }
            // Kalau payload amount lebih besar (pertambahan item transaksi)
            if (Number(payload.amount) > Number(transactionDetail.amount)) {
                if (payload.box) {
                    masterStock.stock_gudang =
                        masterStock.stock_gudang -
                            (Number(payload.amount) - Number(transactionDetail.amount));
                    stockGudang.amount =
                        Number(payload.amount) - Number(transactionDetail.amount);
                    stockToko.code = StocksCode_1.E_GUDANG_CODE_KEY.GUD_SUB_BRG_PENDING_TRANSAKSI;
                }
                else {
                    masterStock.stock_toko =
                        Number(masterStock.stock_toko) -
                            (payload.amount - transactionDetail.amount);
                    stockToko.amount =
                        Number(payload.amount) - Number(transactionDetail.amount);
                    stockToko.code = StocksCode_1.E_TOKO_CODE_KEY.TOK_SUB_BRG_PENDING_TRANSAKSI;
                }
            }
            if (payload.amount < +transactionDetail.amount) {
                if (payload.box) {
                    masterStock.stock_gudang =
                        masterStock.stock_gudang +
                            (Number(transactionDetail.amount) - Number(payload.amount));
                    stockGudang.amount =
                        Number(transactionDetail.amount) - Number(payload.amount);
                    stockGudang.code =
                        StocksCode_1.E_GUDANG_CODE_KEY.GUD_ADD_BRG_PENDING_TRANSAKSI;
                }
                else {
                    masterStock.stock_toko =
                        Number(masterStock.stock_toko) +
                            (Number(transactionDetail.amount) - Number(payload.amount));
                    stockToko.amount =
                        Number(transactionDetail.amount) - Number(payload.amount);
                    stockToko.code = StocksCode_1.E_TOKO_CODE_KEY.TOK_ADD_BRG_PENDING_TRANSAKSI;
                }
            }
            transactionDetail.amount = payload.amount;
            transactionDetail.sub_total = payload.sub_total;
            if (transactionDetail.is_box) {
                stockGudang.stock_id = transactionDetail.stock_id;
                await queryRunner.manager.save(stockGudang);
            }
            else {
                stockToko.stock_id = transactionDetail.stock_id;
                await queryRunner.manager.save(stockToko);
            }
            await queryRunner.manager.save(masterStock);
            return transactionDetail;
        }));
        const deleteData = await Promise.all(transaction.transactionDetails
            .filter(detail => !payloadStockIds.includes(detail.stock_id))
            .map(async (transactionDetail) => {
            const masterStock = await stock_1.Stock.findOneOrFail(transactionDetail.stock_id);
            masterStock.stock_toko =
                Number(masterStock.stock_toko) + transactionDetail.amount;
            const stockToko = new stockToko_1.StockToko();
            stockToko.amount = transactionDetail.amount;
            stockToko.code = StocksCode_1.E_TOKO_CODE_KEY.TOK_ADD_BRG_PENDING_TRANSAKSI;
            stockToko.stock_id = transactionDetail.stock_id;
            await queryRunner.manager.save(stockToko);
            await queryRunner.manager.save(masterStock);
            return transactionDetail;
        }));
        const insertData = await Promise.all(items
            .filter(item => !transactionDetailsIds.includes(item.stock_id))
            .map(async (item) => {
            const transactionDetail = new transactionDetail_1.TransactionDetail();
            transactionDetail.transaction_id = Number(transaction_id);
            transactionDetail.amount = Number(item.amount);
            transactionDetail.sub_total = item.sub_total;
            transactionDetail.stock_id = item.stock_id;
            const masterStock = await stock_1.Stock.findOneOrFail(item.stock_id);
            if (item.box) {
                masterStock.stock_gudang -= Number(item.amount);
                const stockGudang = new stockGudang_1.StockGudang();
                stockGudang.amount = Number(item.amount);
                stockGudang.code = StocksCode_1.E_GUDANG_CODE_KEY.GUD_SUB_BRG_PENDING_TRANSAKSI;
                stockGudang.stock_id = item.stock_id;
                await queryRunner.manager.save(stockGudang);
            }
            else {
                masterStock.stock_toko =
                    Number(masterStock.stock_toko) - Number(item.amount);
                const stockToko = new stockToko_1.StockToko();
                stockToko.amount = Number(item.amount);
                stockToko.code = StocksCode_1.E_TOKO_CODE_KEY.TOK_SUB_BRG_PENDING_TRANSAKSI;
                stockToko.stock_id = item.stock_id;
                await queryRunner.manager.save(stockToko);
            }
            await queryRunner.manager.save(masterStock);
            return transactionDetail;
        }));
        await queryRunner.manager.save(updateData);
        await queryRunner.manager.remove(deleteData);
        await queryRunner.manager.save(insertData);
        await queryRunner.commitTransaction();
        return {
            updateData,
            deleteData,
            insertData
        };
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        console.log(error);
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        await queryRunner.release();
    }
};
exports.updatePendingTransactionService = updatePendingTransactionService;
const deletePendingTransactionService = async (id) => {
    const transaction = await transaction_1.Transaction.findOneOrFail(id, { relations: ['transactionDetails'] });
    if (!transaction)
        throw errorTypes_1.E_ERROR.TRANSACTION_NOT_FOUND;
    const transactionItems = transaction.transactionDetails;
    if (transactionItems.length > 0) {
        await (0, transaction_helper_1.restoreStocks)(transactionItems);
    }
    transaction.status = transaction_2.E_TransactionStatus.VOID;
    await transaction.save();
    return transaction;
};
exports.deletePendingTransactionService = deletePendingTransactionService;
const deletePendingTransactionItemService = async (payload) => {
    const transactionItem = await transactionDetail_1.TransactionDetail.findOne({
        where: {
            transaction_id: payload.transaction_id,
            stock_id: payload.stock_id
        }
    });
    if (!transactionItem)
        throw errorTypes_1.E_ERROR.STOCK_NOT_FOUND;
    await (0, transaction_helper_1.restoreStocks)([transactionItem]);
    return transactionItem;
};
exports.deletePendingTransactionItemService = deletePendingTransactionItemService;
const searchTransactionService = async (query, id) => {
    try {
        const transactions = await transaction_1.Transaction.createQueryBuilder('transaction')
            .where('transaction.transaction_id LIKE :query', { query: `%${id ?? ''}%` })
            .leftJoinAndSelect('transaction.customer', 'customer')
            .leftJoinAndSelect('transaction.cashier', 'cashier')
            .leftJoinAndSelect('transaction.transactionDetails', 'transactionDetails')
            .leftJoinAndSelect('transactionDetails.stock', 'stock')
            .leftJoinAndSelect('stock.product', 'product')
            .leftJoinAndSelect('product.vendor', 'vendor')
            .orderBy('transaction.transaction_id', 'ASC')
            .getMany();
        if (lodash_1.default.isEmpty(transactions))
            throw errorTypes_1.E_ERROR.TRANSACTION_NOT_FOUND;
        return (0, transaction_helper_1.formatTransaction)(transactions);
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.searchTransactionService = searchTransactionService;
const updateTransactionService = async (id, payload) => {
    const queryRunner = app_1.db.queryRunner();
    try {
        await queryRunner.startTransaction();
        const transaction = await transaction_1.Transaction.findOne({ where: { id } });
        const customer = await customer_1.Customer.findOne({ where: { id: payload.customer_id } });
        if (!transaction)
            throw errorTypes_1.E_ERROR.TRANSACTION_NOT_FOUND;
        if (!customer)
            throw errorTypes_1.E_ERROR.CUSTOMER_NOT_FOUND;
        let actual_total_price = 0;
        transaction.transactionDetails.map(detail => {
            const pd = payload.detail.find(detailPayload => detailPayload.id === detail.id);
            if (pd) {
                detail.amount = pd.amount ?? detail.amount;
                // detail.product_id = pd.productId ?? detail.product_id
                detail.sub_total = pd.sub_total ?? detail.sub_total;
                actual_total_price += detail.sub_total;
                return detail;
            }
            return detail;
        });
        if (payload.amount_paid && payload.amount_paid < actual_total_price) {
            transaction.status = languageEnums_1.TRANSACTION_STATUS.PENDING;
            transaction.outstanding_amount = actual_total_price - payload.amount_paid;
            // TODO : NEED TO CHECK MONETARY LOGIC
            const customerMonet = new customerMonetary_1.CustomerMonetary();
            customerMonet.customer = customer;
            customerMonet.amount = transaction.outstanding_amount;
            customerMonet.type = hutangPiutang_1.E_Recievables.DEBT;
            await queryRunner.manager.save(customerMonet);
        }
        else {
            transaction.status = languageEnums_1.TRANSACTION_STATUS.PAID;
            transaction.change = payload.amount_paid
                ? payload.amount_paid - actual_total_price
                : transaction.change;
        }
        transaction.expected_total_price =
            payload.expected_total_price ?? transaction.expected_total_price;
        transaction.actual_total_price =
            payload.actual_total_price ?? transaction.actual_total_price;
        transaction.transaction_date =
            payload.transaction_date ?? transaction.transaction_date;
        transaction.amount_paid = payload.amount_paid ?? transaction.amount_paid;
        await queryRunner.manager.save(transaction);
        await queryRunner.commitTransaction();
        return await transaction_1.Transaction.findOne({ where: { id } });
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
    finally {
        await queryRunner.release();
    }
};
exports.updateTransactionService = updateTransactionService;
const getTransactionByIdService = async (id) => {
    try {
        const transaction = await transaction_1.Transaction.findOne({
            where: { id },
            relations: ['customer', 'transactionDetails']
        });
        if (!transaction)
            throw errorTypes_1.E_ERROR.TRANSACTION_NOT_FOUND;
        return transaction;
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.getTransactionByIdService = getTransactionByIdService;
const deleteTransactionService = async (id) => {
    try {
        const transaction = await transaction_1.Transaction.findOneOrFail({ where: { id } });
        await transaction.remove();
        return { message: 'Transaction is deleted!' };
    }
    catch (error) {
        return await Promise.reject(new errorHandler_1.Errors(error));
    }
};
exports.deleteTransactionService = deleteTransactionService;
