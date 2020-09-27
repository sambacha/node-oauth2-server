"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedRequestError = void 0;
const oauth_error_1 = require("./oauth-error");
class UnauthorizedRequestError extends oauth_error_1.OAuthError {
    constructor(message = '', properties) {
        super(message, Object.assign({ code: 401, name: 'unauthorized_request' }, properties));
    }
}
exports.UnauthorizedRequestError = UnauthorizedRequestError;
//# sourceMappingURL=unauthorized-request-error.js.map