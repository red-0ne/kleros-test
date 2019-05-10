const Lab = require('lab');
const { describe, it } = exports.lab = Lab.script();

describe('GET /eth-rate-convert', () => {
    it('should respond with 400 if no query string is passed');

    it('should respond with 400 if rate query param is not present');

    it('should respond with 400 if rate query param is malformed');

    it('should respond with 400 if price unit is invalid');

    it('should respond with 400 if time unit is malformed');

    it('should respond with 400 if price value is not a number');

    it('should round to the closest integer if result is a float wei');

    it('should ignore casing');

    it('should ignore white spaces');

    it('should handle big numbers');

    it('should handle integers');
});