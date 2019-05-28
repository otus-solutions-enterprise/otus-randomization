var mongodb = require('mongodb');
var _db;




module.exports =  {



    async createTable(randomDocs) {
        var db = new mongodb.Db(
            'randomization',
            new mongodb.Server('localhost', 27017, {}),
            {}
        );

        let colectionName = "testeRandom2";

        db.open( function(err, mongoclient){
            db.authenticate("writer","password");
            mongoclient.collection(colectionName, function(err, collection){
                console.log(randomDocs)
                collection.insertMany(randomDocs, function(err){
                    mongoclient.close();
                    if(err){
                        return{'status' : err};
                    } else {
                        return{'status' : 'inclusao realizada com sucesso'};
                    }
                });
            });
        });
    }

};
