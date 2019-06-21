const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const randomizationSchema = new Schema({
    objectType: {
        type: String,
        default: "RandomizationTableElement"
    },
    tableId: {
        type: ObjectId,
        required: true
    },
    elementOid: {
        type: String,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        default: Date.now,
    },
});

randomizationSchema.statics.createTableElements =async function(randomDocs) {
    return await this.collection.insertMany(randomDocs);
};

randomizationSchema.statics.findNotRandomized =async function(tableId) {
    return await this.collection.find({"tableId" : ObjectId("5d0d1076c84348ba0aaba753"),"elementOid" : null}).cursor().next.then(doc => {
        console.log(doc);
    });

};

mongoose.model('randomization-table-element', randomizationSchema, 'randomization-table');

