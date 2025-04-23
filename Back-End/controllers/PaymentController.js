const Order = require('../models/Order');
const Advertisement = require('../models/Advertisement');
const Package = require('../models/Package');
const paymentGateway = require('../utils/mockPaymentgateway');
const { generateInvoiceWithParams } = require('../utils/invoiceSend');

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
            order.paymentId = paymentVerification.paymentId;
            order.paymentMethod = paymentVerification.method || 'unknown';
            await order.save();

            // Fetch package to get boost duration
            const pkg = await Package.findById(order.packageId);
            if (!pkg) {
                return res.status(404).json({ message: 'Package not found' });
            }

            // Check if the advertisement is already boosted
            const advertisement = await Advertisement.findById(order.advertisementId);
            if (!advertisement) {
                return res.status(404).json({ message: 'Advertisement not found' });
            }

            // Calculate boostedUntil
            const boostDurationMs = pkg.duration * 24 * 60 * 60 * 1000;
            const currentBoostedUntil = advertisement.boostedUntil || null;
            const boostedUntil = currentBoostedUntil
                ? new Date(currentBoostedUntil.getTime() + boostDurationMs)
                : new Date(Date.now() + boostDurationMs);

            // Update only the fields you want in Advertisement
            await Advertisement.findByIdAndUpdate(
                order.advertisementId,
                {
                    isBoosted: '1',
                    isVisible: '1',
                    boostedUntil: boostedUntil,
                    packageId: order.packageId,
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
