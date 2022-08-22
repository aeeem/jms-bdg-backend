"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config({});
// Start the application by listening to specific port
const port = Number(process.env.PORT || process.env.PORT || 8080);
app_1.default.listen(port, () => {
    console.info('Express application started on port: ' + port);
});
