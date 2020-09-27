"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsufficientScopeError = void 0;
const oauth_error_1 = require("./oauth-error");
class InsufficientScopeError extends oauth_error_1.OAuthError {
    constructor(message = '', properties) {
        super(message, Object.assign({ code: 403, name: 'insufficient_scope' }, properties));
    }
}
exports.InsufficientScopeError = InsufficientScopeError;
//# sourceMappingURL=insufficient-scope-error.js.map