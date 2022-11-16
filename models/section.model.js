const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instructor: {type: String, required: true },
  instruments: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'InstrumentsGroups'},

});

module.exports = mongoose.model('Section', sectionSchema);