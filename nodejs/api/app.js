var app = require("./config/server");
const mongoose = require("mongoose");
const listEndpoints = require('express-list-endpoints');

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB,
    API_PORT
} = process.env;

const port = API_PORT || 8080;

const options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    connectTimeoutMS: 10000,
    keepAlive: 1,
    auth: {
        user: MONGO_USERNAME || "root",
        password: MONGO_PASSWORD || "XRYs9yjU"
    }
};

const url = `mongodb://${MONGO_HOSTNAME || "localhost"}:${MONGO_PORT || "27017"}/${MONGO_DB || "otus-randomization"}?authSource=admin`;

connect();

function listen() {
    app.listen(port);
    console.log('Express app started on port ' + port);
}

function connect() {
    mongoose.connection
        .on('error', console.log)
        .on('disconnected', connect)
        .once('open', listen);
    endpointsList();
    return mongoose.connect(url, options);
}

function endpointsList(){
    let endpoints = listEndpoints(app);
    console.table(endpoints)
}


