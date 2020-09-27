"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const handlers_1 = require("../../lib/handlers");
const server_1 = require("../../lib/server");
const Authenticate = handlers_1.AuthenticateHandler;
const Authorize = handlers_1.AuthorizeHandler;
const Token = handlers_1.TokenHandler;
describe('Server', () => {
    describe('authenticate()', () => {
        it('should call `handle`', async () => {
            const model = {
                getAccessToken() { },
            };
            const server = new server_1.OAuth2Server({ model });
            sinon.stub(Authenticate.prototype, 'handle').returns(Promise.resolve());
            await server.authenticate('foo');
            Authenticate.prototype.handle.callCount.should.equal(1);
            Authenticate.prototype.handle.firstCall.args[0].should.equal('foo');
            Authenticate.prototype.handle.restore();
        });
        it('should map string passed as `options` to `options.scope`', async () => {
            const model = {
                getAccessToken() { },
                verifyScope() { },
            };
            const server = new server_1.OAuth2Server({ model });
            sinon.stub(Authenticate.prototype, 'handle').returns(Promise.resolve());
            await server.authenticate('foo', 'bar', 'test');
            Authenticate.prototype.handle.callCount.should.equal(1);
            Authenticate.prototype.handle.firstCall.args[0].should.equal('foo');
            Authenticate.prototype.handle.firstCall.args[1].should.equal('bar');
            Authenticate.prototype.handle.firstCall.thisValue.should.have.property('scope', 'test');
            Authenticate.prototype.handle.restore();
        });
    });
    describe('authorize()', () => {
        it('should call `handle`', async () => {
            const model = {
                getAccessToken() { },
                getClient() { },
                saveAuthorizationCode() { },
            };
            const server = new server_1.OAuth2Server({ model });
            sinon.stub(Authorize.prototype, 'handle').returns(Promise.resolve());
            await server.authorize('foo', 'bar');
            Authorize.prototype.handle.callCount.should.equal(1);
            Authorize.prototype.handle.firstCall.args[0].should.equal('foo');
            Authorize.prototype.handle.restore();
        });
    });
    describe('token()', () => {
        it('should call `handle`', async () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const server = new server_1.OAuth2Server({ model });
            sinon.stub(Token.prototype, 'handle').returns(Promise.resolve());
            await server.token('foo', 'bar');
            Token.prototype.handle.callCount.should.equal(1);
            Token.prototype.handle.firstCall.args[0].should.equal('foo');
            Token.prototype.handle.restore();
        });
    });
});
//# sourceMappingURL=server.spec.js.map