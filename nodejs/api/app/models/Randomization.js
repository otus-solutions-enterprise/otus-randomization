const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const randomizationSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


randomizationSchema.statics.createTable = function(randomDocs) {
    this.collection.insertMany(randomDocs, function (err) {
        if (err){
            return console.error(err);
        } else {
            console.log("Multiple documents inserted to Collection");
        }
    });
};

randomizationSchema.statics.fetchBloc =async function(blocSize,callback) {
    let docsArray = [];
    var cursor = this.aggregate([
        {$match: {group: null}},
        {$sample: {size: blocSize}}]).allowDiskUse(true).cursor({ batchSize: blocSize }).exec();

    await cursor.eachAsync(function(doc) {
        docsArray.push(doc)
    });

    return docsArray;
    // this.collection.aggregate([
    //     {$match: {group: null}},
    //     {$sample: {size: 5}}]
    //     ,function (err, docs) {
    //         if (err) {
    //             return console.error(err);
    //         } else {
    //             let docsArray=[];
    //             docs.forEach((doc)=>{
    //                 docsArray.push(doc);
    //             });
    //             callback(docsArray)
    //         }
    //     });
    // };
    }


mongoose.model('randomization-table', randomizationSchema, 'randomization-table');

