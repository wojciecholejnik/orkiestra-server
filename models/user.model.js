const mongoose = require('mongoose');

// Roles
//   bandDirector: 0,
//   instructor: 1,
//   inspector: 2,
//   musician: 3,
//   paymaster: 4,
//   spectator: 5

const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true }

});

module.exports = mongoose.model('owner', ownerSchema);