describe('Response.js Tests', function () {
    var app, assert;

    beforeEach(function () {
        app = require("../app/utils/Response.js");
        assert = require('assert');
    });

    it('should success response', function () {
        let body = {teste:null};
        let valueCustom = app.success(body);
        assert.equal(valueCustom.code,200);
        assert.equal(valueCustom.body.data,body);

        let valueDefault = app.success();
        assert.equal(valueDefault.code, 200);
        assert.equal(valueDefault.body.data, true);

    });

    it('should notAcceptable response', function () {
        let body = {teste:null};
        let bodyDefault = {message: "Value not acceptable"};
        let valueCustom = app.notAcceptable(body);
        assert.equal(valueCustom.code,406);
        assert.equal(valueCustom.body.data,body);

        let valueDefault = app.notAcceptable();
        assert.equal(valueDefault.code,406);
        assert.deepEqual(valueDefault.body.data,bodyDefault);

    });

    it('should internalServerError response', function () {
        let body = {teste:null};
        let bodyDefault = {message: "There was an error. Please try again later."}
        let valueCustom = app.internalServerError(body);
        assert.equal(valueCustom.code,500);
        assert.equal(valueCustom.body.data,body);

        let valueDefault = app.internalServerError();
        assert.equal(valueDefault.code,500);
        assert.deepEqual(valueDefault.body.data,bodyDefault);

    });

    it('should notFound response', function () {
        let body = {teste:null};
        let bodyDefault = {message: "Data not found"};
        let valueCustom = app.notFound(body);
        assert.equal(valueCustom.code,404);
        assert.equal(valueCustom.body.data,body);

        let valueDefault = app.notFound();
        assert.equal(valueDefault.code,404);
        assert.deepEqual(valueDefault.body.data,bodyDefault);
    });
});