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
  },
  nif: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  sector: {
    type: String,
    required: false,
  },
  status: {
    type: String, // active, inactive, banned
    required: true,
  },
  stellarAcount: {
    type: String,
    required: false,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', copmanySchema)