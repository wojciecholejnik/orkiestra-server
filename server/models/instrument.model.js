const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Section' },
});

module.exports = mongoose.model('Instrument', instrumentSchema);