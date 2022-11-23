"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateTotalBalance = exports.isSubtraction = void 0;
const isAddition = (source) => {
    return source.includes('_ADD_');
};
const isSubtraction = (source) => {
    return source.includes('_SUB_');
};
exports.isSubtraction = isSubtraction;
const CalculateTotalBalance = (monet) => {
    const total = monet.reduce((acc, cur) => {
        if (isAddition(cur.source))
            return acc + cur.amount;
        return acc - cur.amount;
    }, 0);
    return total;
};
exports.CalculateTotalBalance = CalculateTotalBalance;
