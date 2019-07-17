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
  identification: {
    type: String,
    required: true
  },
  group: {
    type: String,
    required: true
  },
  position: {
    type: Number
  },
});

randomizationSchema.statics.createTableElements = async function (randomDocs) {
  return await this.collection.insertMany(randomDocs);
};

randomizationSchema.statics.tableExists = async function (tableId) {
  return await this.findOne({"tableId": tableId})
    .exec();
};

randomizationSchema.statics.findNotRandomized = async function (tableId) {
  return await this.find({"tableId": tableId, "identification": null})
    .sort({position: 1})
    .limit(1)
    .exec();
};

randomizationSchema.statics.getElementGroup = async function (tableId, identification) {
  let promisse = this.findOne({"tableId": tableId, "identification": identification})
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

