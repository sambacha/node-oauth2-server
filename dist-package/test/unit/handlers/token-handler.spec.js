"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
const sinon = require("sinon");
const handlers_1 = require("../../../lib/handlers");
const request_1 = require("../../../lib/request");
describe('TokenHandler', () => {
    describe('getClient()', () => {
        it('should call `model.getClient()`', () => {
            const model = {
                getClient: sinon
                    .stub()
                    .returns(Promise.resolve({ grants: ['password'] })),
                saveToken() { },
            };
            const handler = new handlers_1.TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new request_1.Request({
                body: { client_id: 12345, client_secret: 'secret' },
                headers: {},
                method: 'ANY',
                query: {},
            });
            return handler
                .getClient(request, {})
                .then(() => {
                model.getClient.callCount.should.equal(1);
                model.getClient.firstCall.args.should.have.length(2);
                model.getClient.firstCall.args[0].should.equal(12345);
                model.getClient.firstCall.args[1].should.equal('secret');
                model.getClient.firstCall.thisValue.should.equal(model);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
    });
});
//# sourceMappingURL=token-handler.spec.js.map