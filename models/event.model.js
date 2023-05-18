const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const eventSchema = new mongoose.Schema({
  dateFrom: { type: String, required: true },
  dateTo: { type: String, required: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
  members: [{ type: ObjectId, ref: 'musicians'}],
  externalMembers: [{
    name: { type: String, required: true },
    instrument: { type: String, required: true },
    phone: { type: Number, required: false },
  }],
  address: { type: String, required: true },
  closed: { type: Boolean, required: true },
  year: {type: String, required: true}
});

module.exports = mongoose.model('event', eventSchema);