const mongoose = require('mongoose');

const copmanySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
    default: '',
  },
  nif: {
    type: String,
    required: false,
    default: '',
  },
  phone: {
    type: String,
    required: false,
    default: '',
  },
  sector: {
    type: String,
    required: false,
    default: '',
  },
  status: {
    type: String, // active, inactive, banned
    required: true,
  },
  stellarAcount: {
    type: Object,
    required: false,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', copmanySchema)