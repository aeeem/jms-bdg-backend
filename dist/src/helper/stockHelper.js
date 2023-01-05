"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateTotalStock = exports.isSubtraction = void 0;
const isAddition = (source) => {
    return source.includes('_ADD_');
};
const isSubtraction = (source) => {
    return source.includes('_SUB_');
};
exports.isSubtraction = isSubtraction;
const CalculateTotalStock = (stock) => {
    const total = stock.reduce((acc, cur) => {
        if (isAddition(cur.code))
            return acc + cur.amount;
        return acc - cur.amount;
    }, 0);
    return total;
};
exports.CalculateTotalStock = CalculateTotalStock;
