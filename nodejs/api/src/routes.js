const express = require('express');
const routes = express.Router();

const RandomizationController = require('./controllers/RandomizationController');

//ROUTE
routes.post('/create-table', RandomizationController.createTable);

module.exports = routes;