"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopeFormatter = void 0;
const scopeFormatter = (scopes) => {
    const exclude = [
        'id',
        'created_at',
        'updated_at'
    ];
    const scopeKeys = Object.keys(scopes).filter(key => !exclude.includes(key));
    const sc = {};
    scopeKeys.forEach(scope => {
        const [action, feature] = scope.split('_');
        if (!sc[feature]) {
            sc[feature] = [];
        }
        sc[feature].push(action);
    });
    return sc;
};
exports.scopeFormatter = scopeFormatter;
