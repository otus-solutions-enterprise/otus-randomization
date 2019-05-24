const express = require('express');
const routes = express.Router();

const ProductController = require('./controllers/ProductController');

//ROUTE
routes.get('/products', ProductController.list);
routes.get('/products/:id', ProductController.find);
routes.post('/products', ProductController.create);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.delete);

module.exports = routes;