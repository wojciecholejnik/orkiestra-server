const mongoose = require('mongoose');

const uniformItem = new mongoose.Schema({
  name: { type: String, required: true },
  group: { type: String, required: true},
  state: { type: Number}
});

module.exports = mongoose.model('uniforms-item', uniformItem);