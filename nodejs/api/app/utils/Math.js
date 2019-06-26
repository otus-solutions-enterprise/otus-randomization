module.exports.getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

describe('Math.js Tests', function () {
    var app, assert;
    beforeEach(function () {
        app = require("../utils/Math.js");
        assert = require('assert');
    })
    it('should getRandomInt result', function () {
        var value = app.getRandomInt(1, 5);
        assert(value >= 1);
        assert(value <= 5);
    });
});