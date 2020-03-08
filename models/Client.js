const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
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
  status: {
    type: String, // active, inactive, banned
    required: true,
  },
  secret: {
    type: String,
    reuiqred: false,
  },
  publicKey: {
    type: String,
    required: false,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', clientSchema)