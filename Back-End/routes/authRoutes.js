const express = require('express');
const passport = require('passport');
const { register, login, sendPasswordResetEmail, resetPassword } = require('../controllers/authController');
const { passwordResetOTP, verifyOTP } = require('../controllers/otpController');


const router = express.Router();

// Register user
router.post('/register', register); // register method should be defined in authController.js

//Send OTP
router.post('/send-otp', passwordResetOTP); // sendOTP method should be defined in otpController.js

// Verify OTP
router.post('/verify-otp', verifyOTP); // verifyOTP method should be defined in authController.js

// Send Password Reset Email
router.post('/forgot-password', sendPasswordResetEmail)

// Reset Password
router.post('/reset-password', resetPassword)




// Login user
router.post('/login', login);

// routes.js
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Ensure req.user has both user and token properties
        const { user, token } = req.user;
        const encodedUser = encodeURIComponent(JSON.stringify(user));

        // Redirect with consistent query parameters
        res.redirect(`${process.env.CLIENT_URL}/google/callback?token=${token}&user=${encodedUser}`);
    }
);






module.exports = router;
