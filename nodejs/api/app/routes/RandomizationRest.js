var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

module.exports = function (application) {
  const RandomizationController = application.app.controllers.RandomizationController;
  const RandomizationValidationService = application.app.utils.randomization.ValidationService;

  application.post('/api/create-randomization', jsonParser, async function (req, res) {
    res.header('Content-Type', 'application/json');
    try {
      let randomizationParameters = await RandomizationValidationService.validateRandomization(req.body);
      let result =  await RandomizationController.createProjectRandomization(randomizationParameters);
      res.status(result.code).send(result.body)
    } catch (err) {
      res.status(err.code).send(err.body)
    }
  });

  application.get('/api/project-randomization-list', async function (req, res) {
    res.header('Content-Type', 'application/json');
    try {
      let result =  await RandomizationController.getProjectRandomizationList(req.query.ownerId);
      res.status(result.code).send(result.body)
    } catch (err) {
      res.status(err.code).send(err.body)
    }
  });

  application.post('/api/randomize', jsonParser, function (req, res) {
    res.header('Content-Type', 'application/json');
    let identification = req.body.identification;
    let tableId = req.body.tableId;

    if (!identification || !tableId) {
      res.status(406).send({data: "Invalid Fields"});
      return;
    }

    RandomizationController.randomizeElement(identification, tableId )
      .then(result => {
        res.status(result.code).send(result.body)
      })
      .catch(err => {
        res.status(err.code).send(err.body)
      });
  });

  application.post('/api/element-group', jsonParser, function (req, res) {
    res.header('Content-Type', 'application/json');
    let identification = req.body.identification;
    let tableId = req.body.tableId;

    if (!identification || !tableId) {
      res.status(406).send({data: "Invalid Fields"});
      return;
    }

    application.app.controllers.RandomizationController.getElementGroup(identification, tableId)
      .then(result => {
        res.status(result.code).send(result.body)
      })
      .catch(err => {
        res.status(err.code).send(err.body)
      });
  });
};
