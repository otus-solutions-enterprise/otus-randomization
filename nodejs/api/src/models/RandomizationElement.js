const mongoose = require('mongoose');

const RandomizationElementSchema = new mongoose.Schema({
    group: {
        type: String,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    }
});

mongoose.model('RandomizationTable', RandomizationElementSchema);