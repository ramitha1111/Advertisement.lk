const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Auth = require("../models/user");
const otpController = require("./otpController");
const { Resend } = require("resend");
const crypto = require("crypto");
const User = require("../models/user");

const resend = new Resend(process.env.RESEND_API_KEY);

// Register User
exports.register = async (req, res) => {
  const { firstName, lastName, username, email, password, phone } = req.body;

  try {
    // Check if email already exists
    let user = await Auth.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // Check if the username already exists
    user = await Auth.findOne({ username });
    if (user) return res.status(400).json({ message: "Username taken" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new Auth({ firstName, lastName, username, email, password: hashedPassword, phone });
    await user.save();

    // Send OTP after successful registration
    await otpController.sendOTP(email);

    res.json({ message: "User registered successfully. OTP sent to email for verification." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Auth.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      return res.status(200).json({ message: "Email not verified" , emailVerified: "false" });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user._id, email: user.email, role: user.role} });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Google Authentication
exports.googleAuth = (req, res) => {
  // Google login successful, user and token are available
  const { user, token } = req.user;

  // Send success response with user data and token
  res.json({
    message: "Google login successful",
    user: user,  // Send user data
    token: token, // Send the JWT token for session management
  });

  // Redirect to the client URL with the token
  res.redirect(`${process.env.CLIENT_URL}/user/dashboard?token=${token}&user=${JSON.stringify(user)}`);
};


// Send Password Reset Email
exports.sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    // Create the reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send the email using Resend
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please click the following link to reset your password:\n\n${resetUrl}`,
    });

    res.status(200).send({ message: 'Password reset email sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};


// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body; // Extract new password from request body

  try {
    // Find user by reset token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Check if token is expired
    });

    // If user not found or token expired
    if (!user) {
      return res.status(400).send({ error: 'Invalid or expired token' });
    }

    // Hash the new password before saving
    user.password = await bcrypt.hash(newPassword, 10); // Set the new password
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the expiration date
    await user.save(); // Save the updated user

    res.status(200).send({ message: 'Password has been successfully reset' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).send({ error: error.message });
  }
};