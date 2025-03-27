const Auth = require("../models/Auth");
const nodemailer = require("nodemailer");

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
exports.sendOTP = async (email) => {
  try {
    if (!email) throw new Error("Email is required");

    const otp = generateOTP();
    await Auth.findOneAndUpdate({ email }, { otp }, { upsert: true });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      text: `Your OTP code is ${otp}`,
    });

    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Server error in sending OTP");
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await Auth.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.emailVerified = true;
    user.otp = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
