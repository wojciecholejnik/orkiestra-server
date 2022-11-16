const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const uniformItemModel = require('./uniform-item.model');

const uniformsGroup = new mongoose.Schema({
  name: { type: String, required: true },
  parts: [{ type: ObjectId, ref: 'uniforms-item'}]
});

module.exports = mongoose.model('uniforms-groups', uniformsGroup);