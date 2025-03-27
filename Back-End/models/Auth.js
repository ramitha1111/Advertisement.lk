const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  phone: { type: String, required: true },
  otp: { type: String }, // Field to store OTP
  emailVerified: { type: Boolean, default: false }, // Email verification status
});

module.exports = mongoose.model('Auth', authSchema);
