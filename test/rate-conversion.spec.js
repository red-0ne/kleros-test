const Lab = require('lab');
const { expect } = require('chai');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../dist/server');

describe('GET /eth-rate-convert', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('should respond with 400 if no query string is passed', async () => {
      const res = await server.inject({
          method: 'get',
          url: '/eth-rate-convert'
      });

      expect(res.statusCode).to.equal(400);
      expect(JSON.parse(res.payload).error).to.equal('Bad Request');
    });

    it('should respond with 400 if rate query param is not present', async () => {
      const res = await server.inject({
        method: 'get',
        url: '/eth-rate-convert?foo=bar'
      });

      expect(res.statusCode).to.equal(400);
      expect(JSON.parse(res.payload).error).to.equal('Bad Request');
    });

    it('should respond with 400 if rate query param is malformed', async () => {
      const res = await server.inject({
        method: 'get',
        url: '/eth-rate-convert?rate=bar'
      });

      expect(res.statusCode).to.equal(400);
      expect(JSON.parse(res.payload).error).to.equal('Bad Request');
    });

    it('should respond with 400 if price unit is invalid', async () => {
      const res = await server.inject({
        method: 'get',
        url: '/eth-rate-convert?rate=1foo/hour'
      });

      expect(res.statusCode).to.equal(400);
      expect(JSON.parse(res.payload).error).to.equal('Bad Request');
    });

    it('should respond with 400 if time unit is malformed', async () => {
      const res = await server.inject({
        method: 'get',
        url: '/eth-rate-convert?rate=1wei/bar'
      });

      expect(res.statusCode).to.equal(400);
      expect(JSON.parse(res.payload).error).to.equal('Bad Request');
    });

    it('should respond with 400 if price value is not a number', async () => {
      const res = await server.inject({
        method: 'get',
        url: '/eth-rate-convert?rate=x.01ETHER/day'
      });

      expect(res.statusCode).to.equal(400);
      expect(JSON.parse(res.payload).error).to.equal('Bad Request');
    });

    it('should round to the closest integer if result is a float wei', async () => {
      const res = await server.inject({
        method: 'get',
        url: '/eth-rate-convert?rate=25kwei/day'
      });

      expect(res.statusCode).to.equal(200);
      // (25*1000)/24 = 1041.6666666667
      expect(JSON.parse(res.payload).result).to.equal('1042');
    });

    it('should ignore casing', async () => {
      const res = await server.inject({
        method: 'get',
        url: '/eth-rate-convert?rate=25kWei/DAY'
      });

      expect(res.statusCode).to.equal(200);
      expect(JSON.parse(res.payload).result).to.equal('1042');
    });

    it('should ignore white spaces', async () => {
      const res = await server.inject({
        method: 'get',
        url: '/eth-rate-convert?rate=2 5. 1k wei / da y'
      });

      expect(res.statusCode).to.equal(200);
      expect(JSON.parse(res.payload).result).to.equal('1046');
    });

    it('should handle big numbers', async () => {
      const res = await server.inject({
        method: 'get',
        url: `/eth-rate-convert?rate=${Number.MAX_SAFE_INTEGER}kwei/hour`
      });

      expect(res.statusCode).to.equal(200);
      expect(JSON.parse(res.payload).result).to.equal(Number.MAX_SAFE_INTEGER + '000');
    });

    it('should handle integers', async () => {
      const res = await server.inject({
        method: 'get',
        url: '/eth-rate-convert?rate=25kwei/hour'
      });

      expect(res.statusCode).to.equal(200);
      expect(JSON.parse(res.payload).result).to.equal('25000');
    });

    it('should handle floating price values', async () => {
      const res = await server.inject({
        method: 'get',
        url: '/eth-rate-convert?rate=25.1kwei/hour'
      });

      expect(res.statusCode).to.equal(200);
      expect(JSON.parse(res.payload).result).to.equal('25100');
    });

    it('should always display the result as a fixed number', async () => {
      const res = await server.inject({
        method: 'get',
        url: '/eth-rate-convert?rate=100ether/second'
      });

      expect(res.statusCode).to.equal(200);
      expect(JSON.parse(res.payload).result).to.not.equal('3.6e+23');
      expect(JSON.parse(res.payload).result).to.equal('360000000000000000000000');
    });
});