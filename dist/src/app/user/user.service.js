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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserService = exports.updateUserService = exports.createUserService = exports.getAllUserService = void 0;
const role_1 = require("@entity/role");
const user_1 = require("@entity/user");
const errorHandler_1 = require("src/errorHandler");
const scopeHelper_1 = require("src/helper/scopeHelper");
const getAllUserService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.User.find({ relations: ['role', 'role.scopes'] });
        const formattedUsers = users.map(user => {
            const scopes = (0, scopeHelper_1.scopeFormatter)(user.role.scopes);
            return {
                id: user.id,
                noInduk: user.noInduk,
                name: user.name,
                role: user.role.role,
                scopes
            };
        });
        return formattedUsers;
    }
    catch (e) {
        return new errorHandler_1.Errors(e);
    }
});
exports.getAllUserService = getAllUserService;
const createUserService = ({ email, roles }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _newUser = new user_1.User();
        _newUser.email = email;
        // _newUser.roles = newRoles;
        yield _newUser.save();
        yield Promise.all(roles.map((_role) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const _new = new role_1.Role();
                _new.role = _role;
                _new.user = _newUser;
                return yield _new.save();
            }
            catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
        })));
        return yield user_1.User.findOne({
            where: { email },
            relations: ['roles']
        });
    }
    catch (e) {
        return new errorHandler_1.Errors(e);
    }
});
exports.createUserService = createUserService;
const updateUserService = ({ id, email, roles }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _updatedUser = yield user_1.User.findOne({ where: { id }, relations: ['role'] });
        if (!_updatedUser)
            return { message: 'User is not found!' };
        _updatedUser.email = email;
        // await Promise.all(_updatedUser['role']?.map(async (_role) => {
        //   try {
        //     return _role.remove();
        //   } catch (e) {
        //     console.error(e);
        //   }
        // }));
        yield _updatedUser.save();
        yield Promise.all(roles.map((_role) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const _new = new role_1.Role();
                _new.role = _role;
                _new.user = _updatedUser;
                return yield _new.save();
            }
            catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
        })));
        return yield user_1.User.findOne({
            where: { email },
            relations: ['roles']
        });
    }
    catch (e) {
        return new errorHandler_1.Errors(e);
    }
});
exports.updateUserService = updateUserService;
const deleteUserService = ({ id }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield user_1.User.findOne({ id });
        return yield (foundUser === null || foundUser === void 0 ? void 0 : foundUser.remove());
    }
    catch (e) {
        return new errorHandler_1.Errors(e);
    }
});
exports.deleteUserService = deleteUserService;
