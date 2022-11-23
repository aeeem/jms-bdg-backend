"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorTypes_1 = require("src/constants/errorTypes");
const errorHandler_1 = require("src/errorHandler");
const tsoa_1 = require("tsoa");
const errorResponder = (err, req, res, next) => {
    var _a, _b;
    console.log('here');
    if (err instanceof tsoa_1.ValidateError) {
        // console.error( `Caught Validation Error for ${req.path}:`, err.fields )
        return res.status(422).json({
            type: errorTypes_1.E_ERROR.VALIDATION_ERROR,
            message: 'Validation Failed',
            details: err === null || err === void 0 ? void 0 : err.fields
        });
    }
    if (err instanceof errorHandler_1.Errors) {
        return res.status((_a = err.status) !== null && _a !== void 0 ? _a : 500).json({
            type: err.type,
            message: err.message
        });
    }
    if (err instanceof Error) {
        console.log('here');
        return res.status(500).json({
            errorName: err.name,
            message: err.message,
            stack: (_b = err.stack) !== null && _b !== void 0 ? _b : 'no stack defined'
        });
    }
    next();
};
exports.default = errorResponder;
