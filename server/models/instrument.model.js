const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: String, required: true, ref: 'Section' },
});

module.exports = mongoose.model('Instrument', instrumentSchema);