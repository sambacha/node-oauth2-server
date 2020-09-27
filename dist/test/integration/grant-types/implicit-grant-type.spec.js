"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
const errors_1 = require("../../../lib/errors");
const grant_types_1 = require("../../../lib/grant-types");
const request_1 = require("../../../lib/request");
describe('ImplicitGrantType integration', () => {
    describe('constructor()', () => {
        it('should throw an error if `model` is missing', () => {
            try {
                new grant_types_1.ImplicitGrantType({ accessTokenLifetime: 3600 });
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `model`');
            }
        });
        it('should throw an error if the model does not implement `saveToken()`', () => {
            try {
                const model = {};
                new grant_types_1.ImplicitGrantType({ model, accessTokenLifetime: 3600 });
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Invalid argument: model does not implement `saveToken()`');
            }
        });
        it('should throw an error if the `user` parameter is missing', () => {
            try {
                const model = {
                    saveToken() { },
                };
                new grant_types_1.ImplicitGrantType({ model, accessTokenLifetime: 3600 });
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `user`');
            }
        });
    });
    describe('handle()', () => {
        it('should throw an error if `request` is missing', async () => {
            const model = {
                saveToken() { },
            };
            const grantType = new grant_types_1.ImplicitGrantType({
                accessTokenLifetime: 123,
                model,
                user: {},
            });
            try {
                await grantType.handle();
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `request`');
            }
        });
        it('should throw an error if `client` is missing', async () => {
            const model = {
                saveToken() { },
            };
            const grantType = new grant_types_1.ImplicitGrantType({
                accessTokenLifetime: 123,
                model,
                user: {},
            });
            const request = new request_1.Request({
                body: { code: 12345 },
                headers: {},
                method: 'ANY',
                query: {},
            });
            try {
                await grantType.handle(request, undefined);
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `client`');
            }
        });
        it('should return a token', () => {
            const client = { id: 'foobar' };
            const token = { accessToken: 'foobar-token' };
            const model = {
                saveToken() {
                    return token;
                },
                validateScope() {
                    return 'foo';
                },
            };
            const grantType = new grant_types_1.ImplicitGrantType({
                accessTokenLifetime: 123,
                model,
                user: {},
            });
            const request = new request_1.Request({
                body: { code: 12345 },
                headers: {},
                method: 'ANY',
                query: {},
            });
            return grantType
                .handle(request, client)
                .then(data => {
                data.should.equal(token);
            })
                .catch(should.fail);
        });
        it('should support promises', () => {
            const client = { id: 'foobar' };
            const model = {
                saveToken() { },
            };
            const grantType = new grant_types_1.ImplicitGrantType({
                accessTokenLifetime: 123,
                model,
                user: {},
            });
            const request = new request_1.Request({
                body: { code: 12345 },
                headers: {},
                method: 'ANY',
                query: {},
            });
            grantType.handle(request, client).should.be.an.instanceOf(Promise);
        });
        it('should support non-promises', () => {
            const client = { id: 'foobar' };
            const model = {
                saveToken() { },
            };
            const grantType = new grant_types_1.ImplicitGrantType({
                accessTokenLifetime: 123,
                model,
                user: {},
            });
            const request = new request_1.Request({
                body: { code: 12345 },
                headers: {},
                method: 'ANY',
                query: {},
            });
            grantType.handle(request, client).should.be.an.instanceOf(Promise);
        });
    });
    describe('saveToken()', () => {
        it('should save the token', () => {
            const token = {};
            const model = {
                saveToken() {
                    return token;
                },
                validateScope() {
                    return 'foo';
                },
            };
            const grantType = new grant_types_1.ImplicitGrantType({
                accessTokenLifetime: 123,
                model,
                user: {},
            });
            return grantType
                .saveToken(token)
                .then(data => {
                data.should.equal(token);
            })
                .catch(should.fail);
        });
        it('should support promises', () => {
            const token = {};
            const model = {
                saveToken() {
                    return Promise.resolve(token);
                },
            };
            const grantType = new grant_types_1.ImplicitGrantType({
                accessTokenLifetime: 123,
                model,
                user: {},
            });
            grantType.saveToken(token).should.be.an.instanceOf(Promise);
        });
        it('should support non-promises', () => {
            const token = {};
            const model = {
                saveToken() {
                    return token;
                },
            };
            const grantType = new grant_types_1.ImplicitGrantType({
                accessTokenLifetime: 123,
                model,
                user: {},
            });
            grantType.saveToken(token).should.be.an.instanceOf(Promise);
        });
    });
});
//# sourceMappingURL=implicit-grant-type.spec.js.map