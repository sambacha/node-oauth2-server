"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
const url = require("url");
const errors_1 = require("../../../lib/errors");
const response_types_1 = require("../../../lib/response-types");
describe('TokenResponseType integration', () => {
    describe('constructor()', () => {
        it('should throw an error if `options.accessTokenLifetime` is missing', () => {
            try {
                new response_types_1.TokenResponseType();
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `accessTokenLifetime`');
            }
        });
        it('should set `accessTokenLifetime`', () => {
            const responseType = new response_types_1.TokenResponseType({
                accessTokenLifetime: 120,
                model: {},
            });
            responseType.accessTokenLifetime.should.equal(120);
        });
        it('should set the `model`', () => {
            const model = {
                foobar() { },
            };
            const handler = new response_types_1.TokenResponseType({
                accessTokenLifetime: 120,
                model,
            });
            handler.model.should.equal(model);
        });
    });
    describe('buildRedirectUri()', () => {
        it('should throw an error if the `redirectUri` is missing', () => {
            const responseType = new response_types_1.TokenResponseType({
                accessTokenLifetime: 120,
                model: {},
            });
            try {
                responseType.buildRedirectUri(undefined);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `redirectUri`');
            }
        });
        it('should return the new redirect uri and set `access_token` and `state` in the query', () => {
            const responseType = new response_types_1.TokenResponseType({
                accessTokenLifetime: 120,
                model: {},
            });
            responseType.accessToken = 'foobar-token';
            const redirectUri = responseType.buildRedirectUri(url.parse('http://example.com/cb'));
            url
                .format(redirectUri)
                .should.equal('http://example.com/cb#access_token=foobar-token');
        });
        it('should return the new redirect uri and append `access_token` and `state` in the query', () => {
            const responseType = new response_types_1.TokenResponseType({
                accessTokenLifetime: 120,
                model: {},
            });
            responseType.accessToken = 'foobar-token';
            const redirectUri = responseType.buildRedirectUri(url.parse('http://example.com/cb?foo=bar', true));
            url
                .format(redirectUri)
                .should.equal('http://example.com/cb?foo=bar#access_token=foobar-token');
        });
    });
});
//# sourceMappingURL=token-response-type.spec.js.map