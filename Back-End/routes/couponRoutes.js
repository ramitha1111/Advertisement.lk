const express = require('express');
const router = express.Router();
const { applyCoupon } = require('../controllers/couponController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/coupons/apply', authMiddleware, applyCoupon);

module.exports = router;