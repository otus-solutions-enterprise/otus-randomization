var app = require("./config/server");
const mongoose = require("mongoose");

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB,
    API_PORT
} = process.env;

const options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    connectTimeoutMS: 10000,
    keepAlive: 1,
    auth: {
        user: MONGO_USERNAME,
        password: MONGO_PASSWORD
    }
};

const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

connect();

function listen() {
    app.listen(API_PORT);
    console.log('Express app started on port ' + API_PORT);
}

function connect() {
    mongoose.connection
        .on('error', console.log)
        .on('disconnected', connect)
        .once('open', listen);
    return mongoose.connect(url, options);
}