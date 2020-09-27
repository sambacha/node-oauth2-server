"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
const sinon = require("sinon");
const handlers_1 = require("../../../lib/handlers");
const request_1 = require("../../../lib/request");
const response_1 = require("../../../lib/response");
describe('AuthorizeHandler', () => {
    describe('getClient()', () => {
        it('should call `model.getClient()`', async () => {
            const model = {
                getAccessToken() { },
                getClient: sinon.stub().returns(Promise.resolve({
                    grants: ['authorization_code'],
                    redirectUris: ['http://example.com/cb'],
                })),
                saveAuthorizationCode() { },
            };
            const handler = new handlers_1.AuthorizeHandler({
                authorizationCodeLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: { client_id: 12345, client_secret: 'secret' },
                headers: {},
                method: 'ANY',
                query: {},
            });
            try {
                await handler.getClient(request);
                model.getClient.callCount.should.equal(1);
                model.getClient.firstCall.args.should.have.length(1);
                model.getClient.firstCall.args[0].should.equal(12345);
                model.getClient.firstCall.thisValue.should.equal(model);
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
    });
    describe('getUser()', () => {
        it('should call `authenticateHandler.getUser()`', () => {
            const authenticateHandler = {
                handle: sinon.stub().returns(Promise.resolve({})),
            };
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
                authenticateHandler.handle.callCount.should.equal(1);
                authenticateHandler.handle.firstCall.args.should.have.length(2);
                authenticateHandler.handle.firstCall.args[0].should.equal(request);
                authenticateHandler.handle.firstCall.args[1].should.equal(response);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
    });
});
//# sourceMappingURL=authorize-handler.spec.js.map