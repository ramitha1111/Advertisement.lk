const Auth = require("../models/user");
const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
exports.sendOTP = async (email) => {
  try {
    if (!email) throw new Error("Email is required");

    const otp = generateOTP();
    await Auth.findOneAndUpdate({ email }, { otp }, { upsert: true });

    // Send OTP email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Email Verification OTP - DigiteX',
      text: `Your OTP code is ${otp}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #007bff; padding-bottom: 20px;">
            <h1 style="color: #007bff; margin: 0; font-size: 28px;">DigiteX</h1>
            <p style="margin: 5px 0; color: #666; font-size: 16px;">Email Verification</p>
          </div>
          
          <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
          <p style="color: #666; text-align: center; margin-bottom: 30px;">
            Enter this OTP code to verify your email address:
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="color: #007bff; font-size: 32px; letter-spacing: 4px; margin: 0; font-weight: bold;">${otp}</h3>
          </div>
          
          <p style="color: #666; text-align: center;">
            This code is valid for 10 minutes for security reasons.
          </p>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 30px 0; border: 1px solid #ffeaa7;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>Security Note:</strong> Never share this code with anyone. DigiteX will never ask for your OTP via phone or email.
            </p>
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Best regards,<br>
              The DigiteX Team
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send OTP email');
    }

    console.log(`OTP sent to ${email}`, data);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Server error in sending OTP");
  }
};

// Password Reset OTP
exports.passwordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = generateOTP(); // Generate a 6-digit OTP
    await Auth.findOneAndUpdate({ email }, { otp }, { upsert: true });

    // Send OTP email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Password Reset OTP - DigiteX',
      text: `Your password reset OTP code is ${otp}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #dc3545; padding-bottom: 20px;">
            <h1 style="color: #dc3545; margin: 0; font-size: 28px;">DigiteX</h1>
            <p style="margin: 5px 0; color: #666; font-size: 16px;">Password Reset Request</p>
          </div>
          
          <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
          <p style="color: #666; text-align: center; margin-bottom: 30px;">
            You requested to reset your password. Use the OTP code below:
          </p>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px solid #ffeaa7;">
            <h3 style="color: #856404; font-size: 32px; letter-spacing: 4px; margin: 0; font-weight: bold;">${otp}</h3>
          </div>
          
          <p style="color: #666; text-align: center;">
            Enter this OTP code to reset your password.
          </p>
          
          <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 30px 0; border: 1px solid #f5c6cb;">
            <p style="margin: 0; color: #721c24; font-size: 14px;">
              <strong>Security Alert:</strong> This code will expire in 10 minutes. If you didn't request this, please ignore this email and secure your account.
            </p>
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Best regards,<br>
              The DigiteX Team
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    console.log(`Password reset OTP sent to ${email}`, data);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error in sending OTP" });
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
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};