const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true }

});

module.exports = mongoose.model('owner', ownerSchema);