const express = require('express');
const passport = require('passport');
const { register, login, googleAuth } = require('../controllers/authController');
const { sendOTP, verifyOTP } = require('../controllers/otpController');


const router = express.Router();

// Register user
router.post('/register', register); // register method should be defined in authController.js

// Verify OTP
router.post('/verify-otp', verifyOTP); // verifyOTP method should be defined in authController.js

// Login user
router.post('/login', login);

// Google Authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Authentication callback route
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }), 
  googleAuth  // Callback method to handle the success and send JWT token to frontend
);

module.exports = router;
