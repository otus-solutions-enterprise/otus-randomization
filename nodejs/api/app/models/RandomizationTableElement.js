const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const randomizationSchema = new Schema({
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
        type: Date,
        default: Date.now,
    },
});

randomizationSchema.statics.createTableElements =async function(randomDocs) {
    return await this.collection.insertMany(randomDocs);
};

mongoose.model('randomization-table-element', randomizationSchema, 'randomization-table');

