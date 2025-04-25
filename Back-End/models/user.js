const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  profileImage: { type: String }, // URL or path to the profile image
  phone: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  otp: { type: String }, // Field to store OTP
  emailVerified: { type: Boolean, default: false }, // Email verification status
  googleId: { type: String }, // Google ID for OAuth
  profileImage: { type: String },
  coverImage: { type: String },


  // Fields for password reset
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
