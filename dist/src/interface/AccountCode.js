"use strict";
/* eslint-disable no-tabs */
/* eslint-disable no-multi-spaces */
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountCode = exports.E_CODE_KEY = void 0;
var E_CODE_KEY;
(function (E_CODE_KEY) {
    E_CODE_KEY["DEP_ADD_TRANSACTION_CHANGE"] = "DEP_ADD_TRANSACTION_CHANGE";
    E_CODE_KEY["DEP_ADD_CASH_DEPOSIT"] = "DEP_ADD_CASH_DEPOSIT";
    E_CODE_KEY["DEP_ADD_RETURN_GOODS_CASH"] = "DEP_ADD_RETURN_GOODS_CASH";
    E_CODE_KEY["DEP_ADD_RETURN_GOODS_DEPOSIT"] = "DEP_ADD_RETURN_GOODS_DEPOSIT";
    E_CODE_KEY["DEP_SUB_PAID_WITH_DEPOSIT"] = "DEP_SUB_PAID_WITH_DEPOSIT";
    E_CODE_KEY["DEP_SUB_PAID_DEBT_WITH_DEPOSIT"] = "DEP_SUB_PAID_DEBT_WITH_DEPOSIT";
    E_CODE_KEY["DEBT_ADD_INSUFFICIENT_FUND"] = "DEBT_ADD_INSUFFICIENT_FUND";
    E_CODE_KEY["DEBT_SUB_PAY_WITH_DEPOSIT"] = "DEBT_SUB_PAY_WITH_DEPOSIT";
    E_CODE_KEY["DEBT_SUB_PAY_WITH_CASH"] = "DEBT_SUB_PAY_WITH_CASH";
    E_CODE_KEY["DEBT_SUB_RETURN_GOODS"] = "DEBT_SUB_RETURN_GOODS"; // 'Dari retur barang'
})(E_CODE_KEY = exports.E_CODE_KEY || (exports.E_CODE_KEY = {}));
exports.accountCode = {
    DEBT_ADD_INSUFFICIENT_FUND: {
        action: 'ADD',
        code: 'DEBT_ADD_INSUFFICIENT_FUND',
        type: 'DEBT'
    },
    DEBT_SUB_PAY_WITH_CASH: {
        action: 'SUB',
        code: 'DEBT_SUB_PAY_WITH_CASH',
        type: 'DEBT'
    },
    DEBT_SUB_PAY_WITH_DEPOSIT: {
        action: 'SUB',
        code: 'DEBT_SUB_PAY_WITH_DEPOSIT',
        type: 'DEBT'
    },
    DEBT_SUB_RETURN_GOODS: {
        action: 'SUB',
        code: 'DEBT_SUB_RETURN_GOODS',
        type: 'DEBT'
    },
    DEP_ADD_CASH_DEPOSIT: {
        action: 'ADD',
        code: 'DEP_ADD_CASH_DEPOSIT',
        type: 'DEP'
    },
    DEP_ADD_RETURN_GOODS_CASH: {
        action: 'ADD',
        code: 'DEP_ADD_RETURN_GOODS_CASH',
        type: 'DEP'
    },
    DEP_ADD_RETURN_GOODS_DEPOSIT: {
        action: 'ADD',
        code: 'DEP_ADD_RETURN_GOODS_DEPOSIT',
        type: 'DEP'
    },
    DEP_ADD_TRANSACTION_CHANGE: {
        action: 'ADD',
        code: 'DEP_ADD_TRANSACTION_CHANGE',
        type: 'DEP'
    },
    DEP_SUB_PAID_DEBT_WITH_DEPOSIT: {
        action: 'SUB',
        code: 'DEP_SUB_PAID_DEBT_WITH_DEPOSIT',
        type: 'DEP'
    },
    DEP_SUB_PAID_WITH_DEPOSIT: {
        action: 'SUB',
        code: 'DEP_SUB_PAID_WITH_DEPOSIT',
        type: 'DEP'
    }
};
