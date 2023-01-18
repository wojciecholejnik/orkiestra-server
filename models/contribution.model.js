const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const contributionSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  isClosed: { type: Boolean, required: true },
  members: [
    {
      member: { type: ObjectId, ref: 'member'},
      months: [
        {
          monthNumber: {type: Number, required: true},
          paid: {type: Boolean, required: true}
        }
      ],
    }
  ]

});

module.exports = mongoose.model('contribution', contributionSchema);