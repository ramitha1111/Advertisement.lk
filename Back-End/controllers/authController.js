const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Auth = require("../models/user");
const otpController = require("./otpController");

// Register User
exports.register = async (req, res) => {
  const { name, username, email, password, phone } = req.body;

  try {
    // Check if email already exists
    let user = await Auth.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // Check if username already exists
    user = await Auth.findOne({ username });
    if (user) return res.status(400).json({ message: "Username taken" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new Auth({ name, username, email, password: hashedPassword, phone });
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
      return res.status(403).json({ message: "Email not verified" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Google Authentication
exports.googleAuth = (req, res) => {
  // Google login successful, user and token are available
  const { user, token } = req.user;

  res.json({
    message: "Google login successful",
    user: user,  // Send user data
    token: token, // Send the JWT token for session management
  });
};

