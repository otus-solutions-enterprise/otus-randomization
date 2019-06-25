const express = require('express');
const consign = require('consign');

const app = express();

consign()
  .include('app/utils')
  .then('app/models')
  .then('app/services')
  .then('app/controllers')
  .then('app/routes')
  .into(app);

module.exports = app;
