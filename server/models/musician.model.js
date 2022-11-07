const mongoose = require('mongoose');

const musicianSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: {type: Number, required: false},
  email: {type: String, required: false},
  address1: {type: String, required: false},
  address2: {type: String, required: false},
  instrument: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Instrument'},
  isChild: {type: Boolean, required: true},
  parentName: {type: String, required: false},
  parentPhone: {type: Number, required: false},
  isActive: {type: Boolean, required: true},
  joiningDate: {type: String, required: true },
  birthDate: {type: String, required: true}
});


module.exports = mongoose.model('Musician', musicianSchema);