const Order = require('../models/Order');
const Advertisement = require('../models/Advertisement');
const Package = require('../models/Package');
const paymentGateway = require('../utils/mockPaymentgateway');
const { generateInvoiceWithParams } = require('../controllers/invoiceController');

const verifyPayment = async (req, res) => {
    const { paymentId, orderId } = req.body;

    try {
        // Fetch the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify payment (mock)
        const paymentVerification = await paymentGateway.verifyPayment(paymentId, order.paymentIntentId);

        if (paymentVerification.status === 'succeeded') {
            // Update order status to 'succeeded'
            order.paymentStatus = 'succeeded';
            await order.save();

            // Fetch package to get boost duration
            const pkg = await Package.findById(order.packageId);
            if (!pkg) {
                return res.status(404).json({ message: 'Package not found' });
            }

            // Calculate boostedUntil
            const boostDurationMs = pkg.duration * 24 * 60 * 60 * 1000;
            const boostedUntil = new Date(Date.now() + boostDurationMs);

            // Update only the fields you want in Advertisement
            await Advertisement.findByIdAndUpdate(
                order.advertisementId,
                {
                    isBoosted: true,
                    boostedUntil: boostedUntil,
                },
                { new: true, runValidators: false }
            );

            // Await the result of invoice generation
            const invoiceResponse = await generateInvoiceWithParams(orderId);
            console.log(invoiceResponse.message); // Log success message

            // Return response
            res.status(200).json({
                message: 'Payment verified, order updated, ad boosted, and invoice sent!',
                orderId: order._id,
                status: 'paid',
                boostedUntil,
            });
        } else {
            res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (err) {
        console.error('Payment Verification Error:', err);
        res.status(500).json({ message: 'Error verifying payment', error: err.message });
    }
};


module.exports = { verifyPayment };
