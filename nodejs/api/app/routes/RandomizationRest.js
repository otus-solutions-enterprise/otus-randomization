var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

module.exports = function(application) {
    application.post('/api/create-table',jsonParser, function(req, res) {
        application.app.controllers.RandomizationController.createTable(application, req, res);
    });
};
