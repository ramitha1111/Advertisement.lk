const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    minOrderAmount: { type: Number, default: 0 },
    usageLimit: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Coupon', couponSchema);
