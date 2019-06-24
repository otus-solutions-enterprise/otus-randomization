var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

module.exports = function(application) {
    application.post('/api/create-table',jsonParser, function(req, res) {
        res.header('Content-Type', 'application/json');
        let participants = req.body.participants;
        let blocSize = req.body.blocSize;
        let groups = req.body.groups;
        let projectName = req.body.projectName;

        if(!participants || !blocSize || !groups){
            res.status(406).send({data:"Invalid Fields"})
        }

        application.app.controllers.RandomizationController.createTable(projectName, participants, blocSize, groups)
        .then(result=>{
            res.status(200).send({tableId:result})
        })
        .catch(err =>{
            res.status(err.code).send(err.body)
        });
    });

    application.post('/api/randomize',jsonParser, function(req, res) {
        res.header('Content-Type', 'application/json');
        let elementId = req.body.elementId;
        let tableId = req.body.tableId;

        if(!elementId || !tableId){
            res.status(406).send({data:"Invalid Fields"})
        }

        application.app.controllers.RandomizationController.randomizeElement(elementId, tableId)
            .then(result=>{
                res.status(200).send(result)
            })
            .catch(err =>{
                res.status(err.code).send(err.body)
            });
    });

    application.post('/api/participant-group',jsonParser, function(req, res) {
        res.header('Content-Type', 'application/json');
        let elementId = req.body.elementId;
        let tableId = req.body.tableId;

        if(!elementId || !tableId){
            res.status(406).send({data:"Invalid Fields"})
        }

        application.app.controllers.RandomizationController.getGroupParticipant(elementId, tableId)
            .then(result=>{
                res.status(200).send({data:result})
            })
            .catch(err =>{
                res.status(err.code).send(err.body)
            });
    });
};
