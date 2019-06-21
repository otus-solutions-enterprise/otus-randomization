const express = require('express');
const consign = require('consign');

const app = express();

consign()
  .include('app/routes')
  .then('app/models')
  .then('app/controllers')
  .then('app/services')
  .into(app);

module.exports = app;
