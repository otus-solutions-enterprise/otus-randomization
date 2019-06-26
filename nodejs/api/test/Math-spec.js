describe('Math.js Tests', function () {
    var app, assert;
    beforeEach(function () {
        app = require("../app/utils/Math.js");
        assert = require('assert');
    })
    it('should getRandomInt result', function () {
        var value = app.getRandomInt(1, 5);
        assert(value >= 1);
        assert(value <= 5);
    });
});