const mongoose = require('mongoose');

const resourcesItemsSchema = new mongoose.Schema({
  type: { type: String, required: true, ref: 'Instrument' },
  brand: {type: String},
  model: {type: String},
  serialNumber: {type: String},
  user: {type: String},
  condition: {type: String},
  description: {type: String}
});

module.exports = mongoose.model('Resources', resourcesItemsSchema);