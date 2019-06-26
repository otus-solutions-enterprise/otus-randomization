module.exports.success = function(body){
    let response = {};
    response.code = 200;
    response.body = {data:body};
    return response;
};

module.exports.notAcceptable = function(body){
    let err = {};
    err.code = 406;
    err.body = {data:body};
    return err;
};

module.exports.internalServerError = function(body){
    let err = {};
    err.code = 500;
    err.body = {data:body};
    return err;
};

module.exports.notFound = function(body) {
    let err = {};
    err.code = 404;
    err.body = {data: body};
    return err;
};

describe('Response.js Tests', function () {
    var app, assert;

    beforeEach(function () {
        app = require("../utils/Response.js");
        assert = require('assert');
    });

    it('should success response', function () {
        let body = {teste:null};
        var value = app.success(body);
        assert.equal(value.code,200);
        assert.equal(value.body.data,body);

    });

    it('should notAcceptable response', function () {
        let body = {teste:null};
        var value = app.notAcceptable(body);
        assert.equal(value.code,406);
        assert.equal(value.body.data,body);

    });

    it('should internalServerError response', function () {
        let body = {teste:null};
        var value = app.internalServerError(body);
        assert.equal(value.code,500);
        assert.equal(value.body.data,body);

    });

    it('should notFound response', function () {
        let body = {teste:null};
        var value = app.notFound(body);
        assert.equal(value.code,404);
        assert.equal(value.body.data,body);

    });
});