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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const tsoa_1 = require("tsoa");
const routes_1 = require("../tsoa/routes");
const errorHandler_1 = require("./errorHandler");
const _database_1 = __importDefault(require("@database"));
const enums_1 = require("./errorHandler/enums");
const app = (0, express_1.default)();
/************************************************************************************
 *                              Basic Express Middlewares
 ***********************************************************************************/
const db = new _database_1.default();
app.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    yield db.connectToDB();
}));
app.set('json spaces', 2);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Handle logs in console during development
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
    app.use((0, cors_1.default)());
}
// Handle security and origin in production
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production') {
    app.use((0, helmet_1.default)());
}
/************************************************************************************
 *                               Register all routes
 ***********************************************************************************/
(0, routes_1.RegisterRoutes)(app);
app.use("/docs", swagger_ui_express_1.default.serve, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send(swagger_ui_express_1.default.generateHTML(yield Promise.resolve().then(() => __importStar(require("../tsoa/swagger.json")))));
}));
/************************************************************************************
 *                               Express Error Handling
 ***********************************************************************************/
app.use((err, req, res, next) => {
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
});
app.emit('ready');
app.use(function notFoundHandler(_req, res) {
    return res.status(404).send({ message: "Not Found" });
});
exports.default = app;
