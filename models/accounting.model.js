const mongoose = require('mongoose');

const accountingSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  isClosed: { type: Boolean, required: true },
  balance: {type: Number, required: true },
  history: []

});

module.exports = mongoose.model('accounting', accountingSchema);