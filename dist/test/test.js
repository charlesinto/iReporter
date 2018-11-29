'use strict';

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = _chai2.default.should();
var expect = _chai2.default.expect;
_chai2.default.use(_chaiHttp2.default);

describe('It should test all the end points', function () {
    describe('it should get all red flag records', function () {
        undefined.timeout(40000);
        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/red-flags').type('form').set('content-type', 'application/json').end(function (err, res) {
                expect(res).to.be.an('object');
                done();
            });
        });
        it('response to have property status', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/red-flags').type('form').set('content-type', 'application/json').end(function (err, res) {
                expect(res.body).to.have.property('status');
                done();
            });
        });
        it('response to have property data', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/red-flags').type('form').end(function (err, res) {
                expect(res.body).to.have.property('data');
                done();
            });
        });
        it('response should have a status of 200', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/red-flags').type('form').set('content-type', 'application/json').end(function (err, res) {

                expect(res).to.have.status(200);
                done();
            });
        });

        it('data should be an array', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/red-flags').type('form').set('content-type', 'application/json').end(function (err, res) {
                expect(res.body.data).to.be.an('array');
                done();
            });
        });
    });
});