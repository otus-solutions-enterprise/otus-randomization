var express = require('express');
var consign = require('consign');

var app = express();

consign()
  .include('app/routes')
  .then('app/models')
  .then('app/controllers')
  .then('app/services')
  .into(app);

module.exports = app;
