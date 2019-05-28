const express = require('express');
const routes = express.Router();

const ProductController = require('./controllers/ProductController');

//ROUTE
routes.post('/create-table', ProductController.createTable);

module.exports = routes;