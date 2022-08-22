"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutes = void 0;
const app_1 = __importDefault(require("../../app"));
const getRoutes = () => {
    return new Promise((resolve, reject) => {
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
};
exports.getRoutes = getRoutes;
