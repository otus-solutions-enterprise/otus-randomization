const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const group = new Schema({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
});

const randomizationSchema = new Schema({
  objectType: {
    type: String,
    default: "RandomizationTable"
  },
  name: {
    type: String,
    required: true
  },
  participants: {
    type: Number,
    required: true
  },
  blocSize: {
    type: Number,
    required: true
  },
  groups: [group]
});


randomizationSchema.statics.createTable = async function (projectName) {
  return await this.collection.insertOne({projectName: projectName}).then(result => {
    return result.insertedId
  }).catch(err => {
    throw err;
  });
};


mongoose.model('randomization-table', randomizationSchema, 'randomization-table');
