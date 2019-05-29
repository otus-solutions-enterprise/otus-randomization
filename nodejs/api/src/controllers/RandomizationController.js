const RandomizationService = require('../services/RandomizatioService');

module.exports = {
    async createTable(req, res){
        const createResult = await RandomizationService.createTable(req.body);
        return res.json(createResult);
    }
};