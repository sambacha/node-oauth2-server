"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
const sinon = require("sinon");
const errors_1 = require("../../lib/errors");
const handlers_1 = require("../../lib/handlers");
const request_1 = require("../../lib/request");
const response_1 = require("../../lib/response");
const server_1 = require("../../lib/server");
describe('Server integration', () => {
    describe('constructor()', () => {
        it('should throw an error if `model` is missing', () => {
            try {
                new server_1.OAuth2Server({});
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `model`');
            }
        });
        it('should set the `model`', () => {
            const model = {};
            const server = new server_1.OAuth2Server({ model });
            server.options.model.should.equal(model);
        });
    });
    describe('authenticate()', () => {
        it('should set the default `options`', async () => {
            const model = {
                getAccessToken() {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
            };
            const server = new server_1.OAuth2Server({ model });
            const request = new request_1.Request({
                body: {},
                headers: { Authorization: 'Bearer foo' },
                method: 'ANY',
                query: {},
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            try {
                const stub = sinon
                    .stub(handlers_1.AuthenticateHandler.prototype, 'handle')
                    .returnsThis();
                const token = await server.authenticate(request, response);
                token.addAcceptedScopesHeader.should.be.true();
                token.addAuthorizedScopesHeader.should.be.true();
                token.allowBearerTokensInQueryString.should.be.false();
                stub.restore();
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
        it('should return a promise', () => {
            const model = {
                async getAccessToken(token) {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
            };
            const server = new server_1.OAuth2Server({ model });
            const request = new request_1.Request({
                body: {},
                headers: { Authorization: 'Bearer foo' },
                method: 'ANY',
                query: {},
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            const handler = server.authenticate(request, response);
            handler.should.be.an.instanceOf(Promise);
        });
    });
    describe('authorize()', () => {
        it('should set the default `options`', async () => {
            const model = {
                async getAccessToken() {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
                async getClient() {
                    return {
                        grants: ['authorization_code'],
                        redirectUris: ['http://example.com/cb'],
                    };
                },
                async saveAuthorizationCode() {
                    return { authorizationCode: 123 };
                },
            };
            const server = new server_1.OAuth2Server({ model });
            const request = new request_1.Request({
                body: {
                    client_id: 1234,
                    client_secret: 'secret',
                    response_type: 'code',
                },
                headers: { Authorization: 'Bearer foo' },
                method: 'ANY',
                query: { state: 'foobar' },
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            const stub = sinon
                .stub(handlers_1.AuthorizeHandler.prototype, 'handle')
                .returnsThis();
            const code = await server.authorize(request, response);
            const options = code.options;
            options.allowEmptyState.should.be.false();
            options.authorizationCodeLifetime.should.be.equal(300);
            stub.restore();
        });
        it('should return a promise', () => {
            const model = {
                getAccessToken() {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
                getClient() {
                    return {
                        grants: ['authorization_code'],
                        redirectUris: ['http://example.com/cb'],
                    };
                },
                saveAuthorizationCode() {
                    return { authorizationCode: 123 };
                },
            };
            const server = new server_1.OAuth2Server({ model });
            const request = new request_1.Request({
                body: {
                    client_id: 1234,
                    client_secret: 'secret',
                    response_type: 'code',
                },
                headers: { Authorization: 'Bearer foo' },
                method: 'ANY',
                query: { state: 'foobar' },
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            try {
                const handler = server.authorize(request, response);
                handler.should.be.an.instanceOf(Promise);
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
    });
    describe('token()', () => {
        it('should set the default `options`', async () => {
            const model = {
                async getClient() {
                    return { grants: ['password'] };
                },
                async getUser() {
                    return {};
                },
                async saveToken() {
                    return { accessToken: 1234, client: {}, user: {} };
                },
                async validateScope() {
                    return 'foo';
                },
            };
            const server = new server_1.OAuth2Server({ model });
            const request = new request_1.Request({
                body: {
                    client_id: 1234,
                    client_secret: 'secret',
                    grant_type: 'password',
                    username: 'foo',
                    password: 'pass',
                    scope: 'foo',
                },
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'transfer-encoding': 'chunked',
                },
                method: 'POST',
                query: {},
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            const stub = sinon.stub(handlers_1.TokenHandler.prototype, 'handle').returnsThis();
            const token = await server.token(request, response);
            token.accessTokenLifetime.should.equal(3600);
            token.refreshTokenLifetime.should.equal(1209600);
            stub.restore();
        });
        it('should return a promise', () => {
            const model = {
                async getClient() {
                    return { grants: ['password'] };
                },
                async getUser() {
                    return {};
                },
                async saveToken() {
                    return { accessToken: 1234, client: {}, user: {} };
                },
            };
            const server = new server_1.OAuth2Server({ model });
            const request = new request_1.Request({
                body: {
                    client_id: 1234,
                    client_secret: 'secret',
                    grant_type: 'password',
                    username: 'foo',
                    password: 'pass',
                },
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'transfer-encoding': 'chunked',
                },
                method: 'POST',
                query: {},
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            const handler = server.token(request, response);
            handler.should.be.an.instanceOf(Promise);
        });
    });
});
//# sourceMappingURL=server.spec.js.map