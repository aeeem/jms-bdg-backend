"use strict";
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
exports.getRoutes = void 0;
const app_1 = __importDefault(require("../../app"));
const getRoutes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        try {
            let route;
            const routes = [];
            app_1.default._router.stack.forEach((middleware) => {
                if (middleware.route) { // routes registered directly on the app
                    routes.push(middleware.route);
                }
                else if (middleware.name === 'router') { // router middleware
                    middleware.handle.stack.forEach((handler) => {
                        route = handler.route;
                        route && routes.push(route);
                    });
                }
            });
            resolve(routes);
        }
        catch (e) {
            reject(e);
        }
    });
});
exports.getRoutes = getRoutes;
