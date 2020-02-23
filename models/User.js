const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  stellarAccount: {
    type: String,
    required: false,
  },
  stellarSeed: {
    type: String,
    required: false,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema)