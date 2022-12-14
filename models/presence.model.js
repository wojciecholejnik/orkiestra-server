const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  type: { type: String, required: true },
  members: [
    {
        _id: {type: String, required: true},
        status: {type: String, required: true},
    }
  ]

});

module.exports = mongoose.model('presence', presenceSchema);