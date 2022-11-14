const mongoose = require('mongoose');

const uniformsGroup = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model('uniforms-groups', uniformsGroup);