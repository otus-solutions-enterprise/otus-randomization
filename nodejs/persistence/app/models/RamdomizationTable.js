const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const randomizationSchema = new Schema({
    objectType: {
        type: String,
        default: "RandomizationTable"
    },
    name: {
        type: String,
        required: true
    }
});


randomizationSchema.statics.createTable =async function(projectName) {
    return await this.collection.insertOne({projectName:projectName}).then(result=>{
        return result.insertedId
    }).catch(err => {
        throw err;
    });
};


mongoose.model('randomization-table', randomizationSchema, 'randomization-table');
