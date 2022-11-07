const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instructor: {type: String, required: true }
});

module.exports = mongoose.model('Section', sectionSchema);