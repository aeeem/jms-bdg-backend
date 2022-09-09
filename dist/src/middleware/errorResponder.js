"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("src/errorHandler");
const enums_1 = require("src/errorHandler/enums");
const tsoa_1 = require("tsoa");
const errorResponder = (err, req, res, next) => {
    if (err instanceof tsoa_1.ValidateError) {
        console.error(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            type: enums_1.E_ErrorType.E_VALIDATION_ERROR,
            message: "Validation Failed",
            details: err === null || err === void 0 ? void 0 : err.fields,
        });
    }
    if (err instanceof errorHandler_1.ErrorHandler) {
        return res.status(err.status || 500).json({
            type: err.type,
            message: err.message
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            errorName: err.name,
            message: err.message,
            stack: err.stack || 'no stack defined'
        });
    }
    next();
};
exports.default = errorResponder;
