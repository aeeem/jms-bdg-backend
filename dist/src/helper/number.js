"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padLeft = void 0;
const padLeft = (number, length, character = '0') => {
    let result = String(number);
    for (let i = result.length; i < length; i++) {
        result = character + result;
    }
    return result;
};
exports.padLeft = padLeft;
