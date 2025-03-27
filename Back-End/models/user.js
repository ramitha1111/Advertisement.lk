const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String, required: true },
  otp: { type: String }, // Field to store OTP
  emailVerified: { type: Boolean, default: false }, // Email verification status
});

const User = mongoose.model('User', userSchema);

module.exports = User;
