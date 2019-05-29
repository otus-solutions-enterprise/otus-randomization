const mongoose = require('mongoose');
module.exports =  {
    async createTable(randomDocs) {
         const options = {
            useNewUrlParser: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            connectTimeoutMS: 10000,
        };

        const url = `mongodb://writer:password@localhost:27017/randomization?authSource=randomization`;
        mongoose.connect(url, options);
        var db = mongoose.connection;

        db.on('error', console.error.bind(console, 'connection error:'));

        db.once('open', function() {

            var RandomizationElement = mongoose.Schema({
                recruitmentNumber: {
                    type: String,
                    required: true,
                },
                group: {
                    type: String,
                    required: true,
                },
                position: {
                    type: Number,
                    required: true,
                }
            });

            // compile schema to model
            var Randomization = mongoose.model('RandomizationElement', RandomizationElement, 'testeRandom2');

            Randomization.collection.insert(randomDocs, function (err) {
                if (err){
                    return console.error(err);
                } else {
                    console.log("Multiple documents inserted to Collection");
                }
            });
        });
    },
    async fetchBloc(blocSize) {
        const options = {
            useNewUrlParser: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            connectTimeoutMS: 10000,
        };

        const url = `mongodb://writer:password@localhost:27017/randomization?authSource=randomization`;
        mongoose.connect(url, options);
        var db = mongoose.connection;

        db.on('error', console.error.bind(console, 'connection error:'));

        db.once('open', function() {
            var RandomizationElement = mongoose.Schema({
                recruitmentNumber: {
                    type: String,
                    required: true,
                },
                group: {
                    type: String,
                    required: true,
                },
                position: {
                    type: Number,
                    required: true,
                }
            });

            // compile schema to model
            var Randomization = mongoose.model('RandomizationElement', RandomizationElement, 'testeRandom2');
            Randomization.collection.aggregate([
                {$match:{group:null}},
                {$sample:{size:5}}
            ], function (err,docs) {
                if (err){
                    return console.error(err);
                } else {
                    return docs;
                }
            });
        });
    }


};
