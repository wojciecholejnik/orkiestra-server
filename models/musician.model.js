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
  birthDate: {type: String, required: true},
  isStudent: {type: Boolean},
  isInstructor: {type: Boolean},
  login: {type: String},
  password: {type: String},
  role: {type: String}, // 0: band-director, // 1: instructor, 2: inspector, 4: paymaster
  contributionsAccount: {type: Number, required: true}
});


module.exports = mongoose.model('Musician', musicianSchema);