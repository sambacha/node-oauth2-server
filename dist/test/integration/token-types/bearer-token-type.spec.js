"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
const errors_1 = require("../../../lib/errors");
const token_types_1 = require("../../../lib/token-types");
describe('BearerTokenType integration', () => {
    describe('constructor()', () => {
        it('should throw an error if `accessToken` is missing', () => {
            try {
                new token_types_1.BearerTokenType(undefined, undefined, undefined, undefined, undefined);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `accessToken`');
            }
        });
        it('should set the `accessToken`', () => {
            const responseType = new token_types_1.BearerTokenType('foo', 'bar', undefined, undefined, undefined);
            responseType.accessToken.should.equal('foo');
        });
        it('should set the `accessTokenLifetime`', () => {
            const responseType = new token_types_1.BearerTokenType('foo', 'bar', undefined, undefined, undefined);
            responseType.accessTokenLifetime.should.equal('bar');
        });
        it('should set the `refreshToken`', () => {
            const responseType = new token_types_1.BearerTokenType('foo', 'bar', 'biz', undefined, undefined);
            responseType.refreshToken.should.equal('biz');
        });
    });
    describe('valueOf()', () => {
        it('should return the value representation', () => {
            const responseType = new token_types_1.BearerTokenType('foo', 'bar', undefined, undefined, undefined);
            const value = responseType.valueOf();
            value.should.eql({
                access_token: 'foo',
                expires_in: 'bar',
                token_type: 'Bearer',
            });
        });
        it('should not include the `expires_in` if not given', () => {
            const responseType = new token_types_1.BearerTokenType('foo', undefined, undefined, undefined, undefined);
            const value = responseType.valueOf();
            value.should.eql({
                access_token: 'foo',
                token_type: 'Bearer',
            });
        });
        it('should set `refresh_token` if `refreshToken` is defined', () => {
            const responseType = new token_types_1.BearerTokenType('foo', 'bar', 'biz', undefined, undefined);
            const value = responseType.valueOf();
            value.should.eql({
                access_token: 'foo',
                expires_in: 'bar',
                refresh_token: 'biz',
                token_type: 'Bearer',
            });
        });
        it('should set `expires_in` if `accessTokenLifetime` is defined', () => {
            const responseType = new token_types_1.BearerTokenType('foo', 'bar', 'biz', undefined, undefined);
            const value = responseType.valueOf();
            value.should.eql({
                access_token: 'foo',
                expires_in: 'bar',
                refresh_token: 'biz',
                token_type: 'Bearer',
            });
        });
    });
});
//# sourceMappingURL=bearer-token-type.spec.js.map