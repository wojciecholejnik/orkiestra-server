const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const eventSchema = new mongoose.Schema({
  dateFrom: { type: String, required: true },
  dateTo: { type: String, required: false },
  title: { type: String, required: true },
  playlist: { type: String, required: false },
  uniforms: { type: String, required: false },
  description: { type: String, required: false },
  members: [{ type: ObjectId, ref: 'musicians'}],
  membersAbsent: [{ type: ObjectId, ref: 'musicians'}],
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