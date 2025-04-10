const express = require('express');
const { verifyPayment } = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for verifying payment
router.post('/verify-payment', authMiddleware, verifyPayment);

module.exports = router;