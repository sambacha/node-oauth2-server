"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
const TokenUtil = require("../../../lib/utils/token-util");
describe('TokenUtil integration', () => {
    describe('generateRandomToken()', () => {
        it('should return a sha-1 token', async () => {
            try {
                const token = await TokenUtil.GenerateRandomToken();
                token.should.be.a.sha1();
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
    });
});
//# sourceMappingURL=token-util.spec.js.map