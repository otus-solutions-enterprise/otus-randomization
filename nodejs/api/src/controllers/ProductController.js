const mongoose = require('mongoose');
const RandomizationService = require('../services/RandomizatioService');

const Product = mongoose.model('Product');

module.exports = {

    async createTable(req, res){
        const product = await RandomizationService.createTable(req.body);
        return res.json(product);
    }

};