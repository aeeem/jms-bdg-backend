"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E_CashType = exports.E_CashFlowCode = exports.E_CashFlowType = void 0;
var E_CashFlowType;
(function (E_CashFlowType) {
    E_CashFlowType["CashIn"] = "cash-in";
    E_CashFlowType["CashOut"] = "cash-out";
})(E_CashFlowType = exports.E_CashFlowType || (exports.E_CashFlowType = {}));
var E_CashFlowCode;
(function (E_CashFlowCode) {
    E_CashFlowCode["IN_TRANSACTION"] = "in-transaction";
    E_CashFlowCode["OUT_MISC"] = "out-misc";
    E_CashFlowCode["IN_ADJUSTMENT"] = "in-adjustment";
    E_CashFlowCode["IN_ADD_DEPOSIT"] = "in-add-deposit";
    E_CashFlowCode["IN_PAY_DEBT"] = "in-pay-debt";
})(E_CashFlowCode = exports.E_CashFlowCode || (exports.E_CashFlowCode = {}));
var E_CashType;
(function (E_CashType) {
    E_CashType["TRANSFER"] = "transfer";
    E_CashType["CASH"] = "cash";
})(E_CashType = exports.E_CashType || (exports.E_CashType = {}));
