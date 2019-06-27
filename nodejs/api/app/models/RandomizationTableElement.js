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

randomizationSchema.statics.createTableElements = async function (randomDocs) {
  return await this.collection.insertMany(randomDocs);
};

randomizationSchema.statics.findNotRandomized = async function (tableId) {
  let promisse = this.find({"tableId": tableId, "elementOid": null})
    .sort({position: 1})
    .limit(1)
    .exec();

  return await promisse
    .then(result => {
      return result[0];
    })
    .catch(err => {
      throw err;
    })
};

randomizationSchema.statics.getExistsGroup = async function (tableId, elementId) {
  let promisse = this.findOne({"tableId": tableId, "elementOid": elementId})
    .limit(1)
    .exec();

  return await promisse
    .then(result => {
      return result;
    })
    .catch(err => {
      throw err;
    })
};

mongoose.model('randomization-table-element', randomizationSchema, 'randomization-table');

