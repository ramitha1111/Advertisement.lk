const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  otp: { type: String }, // Field to store OTP
  emailVerified: { type: Boolean, default: false }, // Email verification status
  googleId: { type: String }, // Google ID for OAuth

  // Fields for password reset
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

});

const User = mongoose.model('User', userSchema);

module.exports = User;
