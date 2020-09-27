"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
const url = require("url");
const errors_1 = require("../../../lib/errors");
const handlers_1 = require("../../../lib/handlers");
const request_1 = require("../../../lib/request");
const response_1 = require("../../../lib/response");
const response_types_1 = require("../../../lib/response-types");
describe('AuthorizeHandler integration', () => {
    describe('constructor()', () => {
        it('should throw an error if `options.model` is missing', () => {
            try {
                new handlers_1.AuthorizeHandler({ authorizationCodeLifetime: 120 });
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `model`');
            }
        });
        it('should throw an error if the model does not implement `getClient()`', () => {
            try {
                new handlers_1.AuthorizeHandler({ authorizationCodeLifetime: 120, model: {} });
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Invalid argument: model does not implement `getClient()`');
            }
        });
        it('should throw an error if the model does not implement `getAccessToken()`', () => {
            const model = {
                getClient: () => { },
                saveAuthorizationCode: () => { },
            };
            try {
                new handlers_1.AuthorizeHandler({ authorizationCodeLifetime: 120, model });
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Invalid argument: model does not implement `getAccessToken()`');
            }
        });
        it('should set the `authenticateHandler`', () => {
            const model = {
                getAccessToken: () => { },
                getClient: () => { },
                saveAuthorizationCode: () => { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            handler.authenticateHandler.should.be.an.instanceOf(handlers_1.AuthenticateHandler);
        });
        it('should set the `model`', () => {
            const model = {
                getAccessToken: () => { },
                getClient: () => { },
                saveAuthorizationCode: () => { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            handler.model.should.equal(model);
        });
    });
    describe('handle()', () => {
        it('should throw an error if `request` is missing', async () => {
            const model = {
                getAccessToken: () => { },
                getClient: () => { },
                saveAuthorizationCode: () => { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            try {
                await handler.handle(undefined, undefined);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Invalid argument: `request` must be an instance of Request');
            }
        });
        it('should throw an error if `response` is missing', async () => {
            const model = {
                getAccessToken: () => { },
                getClient: () => { },
                saveAuthorizationCode: () => { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: 'ANY',
                query: {},
            });
            try {
                await handler.handle(request, undefined);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Invalid argument: `response` must be an instance of Response');
            }
        });
        it('should throw an error if `allowed` is `false`', () => {
            const model = {
                getAccessToken: () => { },
                getClient: () => { },
                saveAuthorizationCode: () => { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: 'ANY',
                query: { allowed: 'false' },
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            return handler
                .handle(request, response)
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch(e => {
                e.should.be.an.instanceOf(errors_1.AccessDeniedError);
                e.message.should.equal('Access denied: user denied access to application');
            });
        });
        it('should redirect to an error response if a non-oauth error is thrown', () => {
            const model = {
                getAccessToken: () => {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
                getClient: () => {
                    return {
                        grants: ['authorization_code'],
                        redirectUris: ['http://example.com/cb'],
                    };
                },
                saveAuthorizationCode: () => {
                    throw new Error('Unhandled exception');
                },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {
                    client_id: 12345,
                    response_type: 'code',
                },
                headers: {
                    Authorization: 'Bearer foo',
                },
                method: 'ANY',
                query: {
                    state: 'foobar',
                },
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            return handler
                .handle(request, response)
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch(() => {
                response
                    .get('location')
                    .should.equal('http://example.com/cb?error=server_error&error_description=Unhandled%20exception&state=foobar');
            });
        });
        it('should redirect to an error response if an oauth error is thrown', () => {
            const model = {
                getAccessToken: () => {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
                getClient: () => {
                    return {
                        grants: ['authorization_code'],
                        redirectUris: ['http://example.com/cb'],
                    };
                },
                saveAuthorizationCode: () => {
                    throw new errors_1.AccessDeniedError('Cannot request this auth code');
                },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {
                    client_id: 12345,
                    response_type: 'code',
                },
                headers: {
                    Authorization: 'Bearer foo',
                },
                method: 'ANY',
                query: {
                    state: 'foobar',
                },
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            return handler
                .handle(request, response)
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch(() => {
                response.get('location').should.equal('http://example.com/cb?error=access_denied&error_description=Cannot%20request%20this%20auth%20code&state=foobar');
            });
        });
        it('should redirect to a successful response with `code` and `state` if successful', () => {
            const client = {
                grants: ['authorization_code'],
                redirectUris: ['http://example.com/cb'],
            };
            const model = {
                getAccessToken: () => {
                    return {
                        client,
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
                getClient: () => {
                    return client;
                },
                saveAuthorizationCode: () => {
                    return { authorizationCode: 12345, client };
                },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {
                    client_id: 12345,
                    response_type: 'code',
                },
                headers: {
                    Authorization: 'Bearer foo',
                },
                method: 'ANY',
                query: {
                    state: 'foobar',
                },
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            return handler
                .handle(request, response)
                .then(() => {
                response
                    .get('location')
                    .should.equal('http://example.com/cb?code=12345&state=foobar');
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
        it('should redirect to an error response if `scope` is invalid', () => {
            const model = {
                getAccessToken: () => {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
                getClient: () => {
                    return {
                        grants: ['authorization_code'],
                        redirectUris: ['http://example.com/cb'],
                    };
                },
                saveAuthorizationCode: () => {
                    return {};
                },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {
                    client_id: 12345,
                    response_type: 'code',
                },
                headers: {
                    Authorization: 'Bearer foo',
                },
                method: 'ANY',
                query: {
                    scope: [],
                    state: 'foobar',
                },
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            return handler
                .handle(request, response)
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch(() => {
                response
                    .get('location')
                    .should.equal('http://example.com/cb?error=invalid_scope&error_description=Invalid%20parameter%3A%20%60scope%60');
            });
        });
        it('should redirect to an error response if `state` is missing', () => {
            const model = {
                getAccessToken: () => {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
                getClient: () => {
                    return {
                        grants: ['authorization_code'],
                        redirectUris: ['http://example.com/cb'],
                    };
                },
                saveAuthorizationCode: () => {
                    throw new errors_1.AccessDeniedError('Cannot request this auth code');
                },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {
                    client_id: 12345,
                    response_type: 'code',
                },
                headers: {
                    Authorization: 'Bearer foo',
                },
                method: 'ANY',
                query: {},
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            return handler
                .handle(request, response)
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch(() => {
                response
                    .get('location')
                    .should.equal('http://example.com/cb?error=invalid_request&error_description=Missing%20parameter%3A%20%60state%60');
            });
        });
        it('should redirect to an error response if `response_type` is invalid', () => {
            const model = {
                getAccessToken: () => {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
                getClient: () => {
                    return {
                        grants: ['authorization_code'],
                        redirectUris: ['http://example.com/cb'],
                    };
                },
                saveAuthorizationCode: () => {
                    return { authorizationCode: 12345, client: {} };
                },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {
                    client_id: 12345,
                    response_type: 'test',
                },
                headers: {
                    Authorization: 'Bearer foo',
                },
                method: 'ANY',
                query: {
                    state: 'foobar',
                },
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            return handler
                .handle(request, response)
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch(() => {
                response.get('location').should.equal('http://example.com/cb?error=unsupported_response_type&error_description=Unsupported%20response%20type%3A%20%60response_type%60%20is%20not%20supported&state=foobar');
            });
        });
        it('should fail on invalid `response_type` before calling model.saveAuthorizationCode()', () => {
            const model = {
                getAccessToken: () => {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
                getClient: () => {
                    return {
                        grants: ['authorization_code'],
                        redirectUris: ['http://example.com/cb'],
                    };
                },
                saveAuthorizationCode: () => {
                    throw new Error('must not be reached');
                },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {
                    client_id: 12345,
                    response_type: 'test',
                },
                headers: {
                    Authorization: 'Bearer foo',
                },
                method: 'ANY',
                query: {
                    state: 'foobar',
                },
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            return handler
                .handle(request, response)
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch(() => {
                response.get('location').should.equal('http://example.com/cb?error=unsupported_response_type&error_description=Unsupported%20response%20type%3A%20%60response_type%60%20is%20not%20supported&state=foobar');
            });
        });
        it('should return the `code` if successful', () => {
            const client = {
                grants: ['authorization_code'],
                redirectUris: ['http://example.com/cb'],
            };
            const model = {
                getAccessToken: () => {
                    return {
                        client,
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
                getClient() {
                    return client;
                },
                saveAuthorizationCode() {
                    return { authorizationCode: 12345, client };
                },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {
                    client_id: 12345,
                    response_type: 'code',
                },
                headers: {
                    Authorization: 'Bearer foo',
                },
                method: 'ANY',
                query: {
                    state: 'foobar',
                },
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            return handler
                .handle(request, response)
                .then(data => {
                data.should.eql({
                    authorizationCode: 12345,
                    client,
                });
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
    });
    describe('getClient()', () => {
        it('should throw an error if `client_id` is missing', async () => {
            const model = {
                getAccessToken() { },
                getClient() { },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: { response_type: 'code' },
                headers: {},
                method: 'ANY',
                query: {},
            });
            try {
                await handler.getClient(request);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidRequestError);
                e.message.should.equal('Missing parameter: `client_id`');
            }
        });
        it('should throw an error if `client_id` is invalid', async () => {
            const model = {
                getAccessToken() { },
                getClient() { },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: { client_id: 'øå€£‰', response_type: 'code' },
                headers: {},
                method: 'ANY',
                query: {},
            });
            try {
                await handler.getClient(request);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidRequestError);
                e.message.should.equal('Invalid parameter: `client_id`');
            }
        });
        it('should throw an error if `client.redirectUri` is invalid', async () => {
            const model = {
                getAccessToken() { },
                getClient() { },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {
                    client_id: 12345,
                    response_type: 'code',
                    redirect_uri: 'foobar',
                },
                headers: {},
                method: 'ANY',
                query: {},
            });
            try {
                await handler.getClient(request);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidRequestError);
                e.message.should.equal('Invalid request: `redirect_uri` is not a valid URI');
            }
        });
        it('should throw an error if `client` is missing', () => {
            const model = {
                getAccessToken() { },
                getClient() { },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: { client_id: 12345, response_type: 'code' },
                headers: {},
                method: 'ANY',
                query: {},
            });
            return handler
                .getClient(request)
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch(e => {
                e.should.be.an.instanceOf(errors_1.InvalidClientError);
                e.message.should.equal('Invalid client: client credentials are invalid');
            });
        });
        it('should throw an error if `client.grants` is missing', () => {
            const model = {
                getAccessToken() { },
                getClient() {
                    return {};
                },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: { client_id: 12345, response_type: 'code' },
                headers: {},
                method: 'ANY',
                query: {},
            });
            return handler
                .getClient(request)
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch(e => {
                e.should.be.an.instanceOf(errors_1.InvalidClientError);
                e.message.should.equal('Invalid client: missing client `grants`');
            });
        });
        it('should throw an error if `client` is unauthorized', () => {
            const model = {
                getAccessToken() { },
                getClient() {
                    return { grants: [] };
                },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: { client_id: 12345, response_type: 'code' },
                headers: {},
                method: 'ANY',
                query: {},
            });
            return handler
                .getClient(request)
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch(e => {
                e.should.be.an.instanceOf(errors_1.UnauthorizedClientError);
                e.message.should.equal('Unauthorized client: `grant_type` is invalid');
            });
        });
        it('should throw an error if `client.redirectUri` is missing', () => {
            const model = {
                getAccessToken() { },
                getClient() {
                    return { grants: ['authorization_code'] };
                },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: { client_id: 12345, response_type: 'code' },
                headers: {},
                method: 'ANY',
                query: {},
            });
            return handler
                .getClient(request)
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch(e => {
                e.should.be.an.instanceOf(errors_1.InvalidClientError);
                e.message.should.equal('Invalid client: missing client `redirectUri`');
            });
        });
        it('should throw an error if `client.redirectUri` is not equal to `redirectUri`', () => {
            const model = {
                getAccessToken() { },
                getClient() {
                    return {
                        grants: ['authorization_code'],
                        redirectUris: ['https://example.com'],
                    };
                },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {
                    client_id: 12345,
                    response_type: 'code',
                    redirect_uri: 'https://foobar.com',
                },
                headers: {},
                method: 'ANY',
                query: {},
            });
            return handler
                .getClient(request)
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch(e => {
                e.should.be.an.instanceOf(errors_1.InvalidClientError);
                e.message.should.equal('Invalid client: `redirect_uri` does not match client value');
            });
        });
        it('should support promises', async () => {
            const model = {
                getAccessToken() { },
                async getClient() {
                    return {
                        grants: ['authorization_code'],
                        redirectUris: ['http://example.com/cb'],
                    };
                },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: { client_id: 12345 },
                headers: {},
                method: 'ANY',
                query: {},
            });
            try {
                handler.getClient(request).should.be.an.instanceOf(Promise);
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
        describe('with `client_id` in the request query', () => {
            it('should return a client', () => {
                const client = {
                    grants: ['authorization_code'],
                    redirectUris: ['http://example.com/cb'],
                };
                const model = {
                    getAccessToken() { },
                    getClient() {
                        return client;
                    },
                    saveAuthorizationCode() { },
                };
                const handler = new handlers_1.AuthorizeHandler({
                    authorizationCodeLifetime: 120,
                    model,
                });
                const request = new request_1.Request({
                    body: { response_type: 'code' },
                    headers: {},
                    method: 'ANY',
                    query: { client_id: 12345 },
                });
                return handler
                    .getClient(request)
                    .then(data => {
                    data.should.equal(client);
                })
                    .catch(() => {
                    should.fail('should.fail', '');
                });
            });
        });
    });
    describe('getScope()', () => {
        it('should throw an error if `scope` is invalid', () => {
            const model = {
                getAccessToken() { },
                getClient() { },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: { scope: 'øå€£‰' },
                headers: {},
                method: 'ANY',
                query: {},
            });
            try {
                handler.getScope(request);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidScopeError);
                e.message.should.equal('Invalid parameter: `scope`');
            }
        });
        describe('with `scope` in the request body', () => {
            it('should return the scope', () => {
                const model = {
                    getAccessToken() { },
                    getClient() { },
                    saveAuthorizationCode() { },
                };
                const handler = new handlers_1.AuthorizeHandler({
                    authorizationCodeLifetime: 120,
                    model,
                });
                const request = new request_1.Request({
                    body: { scope: 'foo' },
                    headers: {},
                    method: 'ANY',
                    query: {},
                });
                handler.getScope(request).should.equal('foo');
            });
        });
        describe('with `scope` in the request query', () => {
            it('should return the scope', () => {
                const model = {
                    getAccessToken() { },
                    getClient() { },
                    saveAuthorizationCode() { },
                };
                const handler = new handlers_1.AuthorizeHandler({
                    authorizationCodeLifetime: 120,
                    model,
                });
                const request = new request_1.Request({
                    body: {},
                    headers: {},
                    method: 'ANY',
                    query: { scope: 'foo' },
                });
                handler.getScope(request).should.equal('foo');
            });
        });
    });
    describe('getState()', () => {
        it('should throw an error if `allowEmptyState` is false and `state` is missing', () => {
            const model = {
                getAccessToken() { },
                getClient() { },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                allowEmptyState: false,
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: 'ANY',
                query: {},
            });
            try {
                handler.getState(request);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidRequestError);
                e.message.should.equal('Missing parameter: `state`');
            }
        });
        it('should throw an error if `state` is invalid', () => {
            const model = {
                getAccessToken() { },
                getClient() { },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: 'ANY',
                query: { state: 'øå€£‰' },
            });
            try {
                handler.getState(request);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidRequestError);
                e.message.should.equal('Invalid parameter: `state`');
            }
        });
        describe('with `state` in the request body', () => {
            it('should return the state', () => {
                const model = {
                    getAccessToken() { },
                    getClient() { },
                    saveAuthorizationCode() { },
                };
                const handler = new handlers_1.AuthorizeHandler({
                    authorizationCodeLifetime: 120,
                    model,
                });
                const request = new request_1.Request({
                    body: { state: 'foobar' },
                    headers: {},
                    method: 'ANY',
                    query: {},
                });
                handler.getState(request).should.equal('foobar');
            });
        });
        describe('with `state` in the request query', () => {
            it('should return the state', () => {
                const model = {
                    getAccessToken() { },
                    getClient() { },
                    saveAuthorizationCode() { },
                };
                const handler = new handlers_1.AuthorizeHandler({
                    authorizationCodeLifetime: 120,
                    model,
                });
                const request = new request_1.Request({
                    body: {},
                    headers: {},
                    method: 'ANY',
                    query: { state: 'foobar' },
                });
                handler.getState(request).should.equal('foobar');
            });
        });
    });
    describe('getUser()', () => {
        it('should throw an error if `user` is missing', () => {
            const authenticateHandler = { handle() { } };
            const model = {
                getClient() { },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authenticateHandler,
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: 'ANY',
                query: {},
            });
            const response = new response_1.Response();
            return handler
                .getUser(request, response)
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch(e => {
                e.should.be.an.instanceOf(errors_1.ServerError);
                e.message.should.equal('Server error: `handle()` did not return a `user` object');
            });
        });
        it('should return a user', () => {
            const user = {};
            const model = {
                getAccessToken() {
                    return {
                        user,
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
                getClient() { },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: { Authorization: 'Bearer foo' },
                method: 'ANY',
                query: {},
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            return handler
                .getUser(request, response)
                .then(data => {
                data.should.equal(user);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
    });
    describe('buildSuccessRedirectUri()', () => {
        it('should return a redirect uri', () => {
            const model = {
                getAccessToken() { },
                getClient() { },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const responseType = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 360,
                model: { saveAuthorizationCode: () => { } },
            });
            responseType.code = 12345;
            const redirectUri = handler.buildSuccessRedirectUri('http://example.com/cb', responseType);
            url.format(redirectUri).should.equal('http://example.com/cb?code=12345');
        });
    });
    describe('buildErrorRedirectUri()', () => {
        it('should set `error_description` if available', () => {
            const error = new errors_1.InvalidClientError('foo bar');
            const model = {
                getAccessToken() { },
                getClient() { },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const responseType = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 360,
                model: { saveAuthorizationCode: () => { } },
            });
            const redirectUri = handler.buildErrorRedirectUri('http://example.com/cb', responseType, error);
            url
                .format(redirectUri)
                .should.equal('http://example.com/cb?error=invalid_client&error_description=foo%20bar');
        });
        it('should return a redirect uri', () => {
            const error = new errors_1.InvalidClientError();
            const model = {
                getAccessToken() { },
                getClient() { },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const responseType = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 360,
                model: { saveAuthorizationCode: () => { } },
            });
            const redirectUri = handler.buildErrorRedirectUri('http://example.com/cb', responseType, error);
            url
                .format(redirectUri)
                .should.equal('http://example.com/cb?error=invalid_client&error_description=Bad%20Request');
        });
    });
    describe('updateResponse()', () => {
        it('should set the `location` header', () => {
            const model = {
                getAccessToken() { },
                getClient() { },
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const responseType = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 360,
                model: { saveAuthorizationCode: () => { } },
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            const uri = url.parse('http://example.com/cb', true);
            handler.updateResponse(response, uri, responseType, 'foobar');
            response
                .get('location')
                .should.equal('http://example.com/cb?state=foobar');
        });
    });
});
//# sourceMappingURL=authorize-handler.spec.js.map