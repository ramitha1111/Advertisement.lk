const Coupon = require('../models/coupon');

// POST /api/coupons/apply
exports.applyCoupon = async (req, res) => {
    const { couponCode, totalAmount } = req.body;

    try {
        const coupon = await Coupon.findOne({ code: couponCode });

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found.' });
        }

        if (coupon.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Coupon expired.' });
        }

        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon usage limit reached.' });
        }

        if (totalAmount < coupon.minOrderAmount) {
            return res.status(400).json({ message: `Minimum order amount is ${coupon.minOrderAmount}.` });
        }

        let discount = 0;

        if (coupon.discountType === 'percentage') {
            discount = (coupon.discountValue / 100) * totalAmount;
        } else {
            discount = coupon.discountValue;
        }

        const finalAmount = totalAmount - discount;

        res.status(200).json({
            message: 'Coupon applied successfully.',
            discount,
            finalAmount,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
