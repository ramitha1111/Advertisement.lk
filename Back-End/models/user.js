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
  role: { type: String, enum: ['user', 'admin'], default: 'admin' }, // change this to user
  otp: { type: String }, // Field to store OTP
  emailVerified: { type: Boolean, default: true }, // change this to default false
  googleId: { type: String }, // Google ID for OAuth
  profileImage: { type: String },
  coverImage: { type: String },


  // Fields for password reset
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
