"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenResponseType = void 0;
const errors_1 = require("../errors");
const grant_types_1 = require("../grant-types");
class TokenResponseType {
    constructor(options = {}) {
        if (!options.accessTokenLifetime) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `accessTokenLifetime`');
        }
        this.accessToken = undefined;
        this.accessTokenLifetime = options.accessTokenLifetime;
        this.model = options.model;
    }
    async handle(request, client, user, uri, scope) {
        if (!request) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `request`');
        }
        if (!client) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `client`');
        }
        const accessTokenLifetime = this.getAccessTokenLifetime(client);
        const options = {
            user,
            scope,
            model: this.model,
            accessTokenLifetime,
        };
        const grantType = new grant_types_1.ImplicitGrantType(options);
        const token = await grantType.handle(request, client);
        this.accessToken = token.accessToken;
        return token;
    }
    getAccessTokenLifetime(client) {
        return client.accessTokenLifetime || this.accessTokenLifetime;
    }
    buildRedirectUri(redirectUri) {
        return this.setRedirectUriParam(redirectUri, 'access_token', this.accessToken);
    }
    setRedirectUriParam(redirectUri, key, value) {
        if (!redirectUri) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `redirectUri`');
        }
        if (!key) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `key`');
        }
        redirectUri.hash = redirectUri.hash || '';
        redirectUri.hash += `${redirectUri.hash ? '&' : ''}${key}=${encodeURIComponent(value)}`;
        return redirectUri;
    }
}
exports.TokenResponseType = TokenResponseType;
//# sourceMappingURL=token-response-type.js.map