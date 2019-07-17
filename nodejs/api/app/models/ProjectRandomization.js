const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const group = new Schema({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
},{ _id : false });

const constructionParameters = new Schema({
  participants: {
    type: Number,
    required: true
  },
  blocSize: {
    type: Number,
    required: true
  },
  groups: [group]
},{ _id : false });

const randomizationTable = new Schema({
  name: {
    type: String,
    required: true
  },
  tableId: {
    type: ObjectId,
    required: true
  },
  constructionParameters: constructionParameters
},{ _id : false });

const projectSchema = new Schema({
  ownerId: {
    type: ObjectId,
    required: true
  },
  objectType: {
    type: String,
    default: "ProjectRandomization"
  },
  randomizationType: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  tables: {
    type: [randomizationTable],
    default: []
  }
});

mongoose.model('project-randomization', projectSchema, 'project-randomization');
mongoose.model('randomization-table', randomizationTable);
