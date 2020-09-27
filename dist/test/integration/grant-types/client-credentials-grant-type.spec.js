"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
const errors_1 = require("../../../lib/errors");
const grant_types_1 = require("../../../lib/grant-types");
const request_1 = require("../../../lib/request");
describe('ClientCredentialsGrantType integration', () => {
    describe('constructor()', () => {
        it('should throw an error if `model` is missing', () => {
            try {
                new grant_types_1.ClientCredentialsGrantType({ accessTokenLifetime: 3600 });
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `model`');
            }
        });
        it('should throw an error if the model does not implement `getUserFromClient()`', () => {
            try {
                new grant_types_1.ClientCredentialsGrantType({
                    accessTokenLifetime: 3600,
                    model: {},
                });
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Invalid argument: model does not implement `getUserFromClient()`');
            }
        });
        it('should throw an error if the model does not implement `saveToken()`', () => {
            try {
                const model = {
                    getUserFromClient() { },
                };
                new grant_types_1.ClientCredentialsGrantType({ accessTokenLifetime: 3600, model });
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Invalid argument: model does not implement `saveToken()`');
            }
        });
    });
    describe('handle()', () => {
        it('should throw an error if `request` is missing', async () => {
            const model = {
                getUserFromClient() { },
                saveToken() { },
            };
            const grantType = new grant_types_1.ClientCredentialsGrantType({
                accessTokenLifetime: 120,
                model,
            });
            try {
                await grantType.handle(undefined, undefined);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `request`');
            }
        });
        it('should throw an error if `client` is missing', async () => {
            const model = {
                getUserFromClient() { },
                saveToken() { },
            };
            const grantType = new grant_types_1.ClientCredentialsGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: 'ANY',
                query: {},
            });
            try {
                await grantType.handle(request, undefined);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `client`');
            }
        });
        it('should return a token', () => {
            const token = {};
            const model = {
                getUserFromClient() {
                    return {};
                },
                saveToken() {
                    return token;
                },
                validateScope() {
                    return 'foo';
                },
            };
            const grantType = new grant_types_1.ClientCredentialsGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: 'ANY',
                query: {},
            });
            return grantType
                .handle(request, {})
                .then(data => {
                data.should.equal(token);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
        it('should support promises', () => {
            const token = {};
            const model = {
                getUserFromClient() {
                    return {};
                },
                saveToken() {
                    return token;
                },
            };
            const grantType = new grant_types_1.ClientCredentialsGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: 'ANY',
                query: {},
            });
            grantType.handle(request, {}).should.be.an.instanceOf(Promise);
        });
        it('should support non-promises', () => {
            const token = {};
            const model = {
                getUserFromClient() {
                    return {};
                },
                saveToken() {
                    return token;
                },
            };
            const grantType = new grant_types_1.ClientCredentialsGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: 'ANY',
                query: {},
            });
            grantType.handle(request, {}).should.be.an.instanceOf(Promise);
        });
    });
    describe('getUserFromClient()', () => {
        it('should throw an error if `user` is missing', () => {
            const model = {
                getUserFromClient() { },
                saveToken() { },
            };
            const grantType = new grant_types_1.ClientCredentialsGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: 'ANY',
                query: {},
            });
            return grantType
                .getUserFromClient({})
                .then(() => {
                should.fail('should.fail', '');
            })
                .catch((e) => {
                e.should.be.an.instanceOf(errors_1.InvalidGrantError);
                e.message.should.equal('Invalid grant: user credentials are invalid');
            });
        });
        it('should return a user', async () => {
            const user = { email: 'foo@bar.com' };
            const model = {
                getUserFromClient() {
                    return user;
                },
                saveToken() { },
            };
            const grantType = new grant_types_1.ClientCredentialsGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: 'ANY',
                query: {},
            });
            try {
                const data = await grantType.getUserFromClient({});
                data.should.equal(user);
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
        it('should support promises', () => {
            const user = { email: 'foo@bar.com' };
            const model = {
                getUserFromClient() {
                    return Promise.resolve(user);
                },
                saveToken() { },
            };
            const grantType = new grant_types_1.ClientCredentialsGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: 'ANY',
                query: {},
            });
            grantType.getUserFromClient({}).should.be.an.instanceOf(Promise);
        });
        it('should support non-promises', () => {
            const user = { email: 'foo@bar.com' };
            const model = {
                getUserFromClient() {
                    return user;
                },
                saveToken() { },
            };
            const grantType = new grant_types_1.ClientCredentialsGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: 'ANY',
                query: {},
            });
            grantType.getUserFromClient({}).should.be.an.instanceOf(Promise);
        });
    });
    describe('saveToken()', () => {
        it('should save the token', async () => {
            const token = {};
            const model = {
                getUserFromClient() { },
                saveToken() {
                    return token;
                },
                validateScope() {
                    return 'foo';
                },
            };
            const grantType = new grant_types_1.ClientCredentialsGrantType({
                accessTokenLifetime: 123,
                model,
            });
            try {
                const data = await grantType.saveToken({}, {}, token);
                data.should.equal(token);
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
        it('should support promises', () => {
            const token = {};
            const model = {
                getUserFromClient() { },
                saveToken() {
                    return Promise.resolve(token);
                },
            };
            const grantType = new grant_types_1.ClientCredentialsGrantType({
                accessTokenLifetime: 123,
                model,
            });
            grantType
                .saveToken({}, {}, token)
                .should.be.an.instanceOf(Promise);
        });
    });
});
//# sourceMappingURL=client-credentials-grant-type.spec.js.map