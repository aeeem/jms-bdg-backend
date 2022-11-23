"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config({});
// Start the application by listening to specific port
const port = Number((_b = ((_a = process.env.PORT) !== null && _a !== void 0 ? _a : process.env.PORT)) !== null && _b !== void 0 ? _b : 8080);
app_1.default.listen(port, () => {
    console.info(`Express application started on port: ${port}`);
});
