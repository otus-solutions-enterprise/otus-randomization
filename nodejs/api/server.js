const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

//iniciando o app
const app = express();
app.use(express.json());

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
} = process.env;

const options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    connectTimeoutMS: 10000,
};

const url = `mongodb://writer:password@localhost:27017/randomization?authSource=admin`;

//conexao com o DB
mongoose.connect(url, options);

requireDir('src/models');
requireDir('src/services');


app.use('/api', require("./src/routes"));

app.listen(3001);