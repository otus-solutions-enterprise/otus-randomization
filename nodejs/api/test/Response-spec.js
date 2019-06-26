describe('Response.js Tests', function () {
    var app, assert;

    beforeEach(function () {
        app = require("../app/utils/Response.js");
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