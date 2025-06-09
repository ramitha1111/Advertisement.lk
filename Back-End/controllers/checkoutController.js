const Order = require('../models/order');
const paymentGateway = require('../utils/mockPaymentgateway');
const Package = require("../models/package");

const checkout = async (req, res) => {
    const {
        firstName, lastName, companyName, country,
        addressLine1, addressLine2, city, state, zip, phone, email,
        packageId, packageName, advertisementId, amount
    } = req.body;

    try {
        const userId = req.user.id;

        // Fetch the selected package details
        const packageDetails = await Package.findById(packageId);
        if (!packageDetails) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // Create payment intent via the payment gateway
        const paymentResponse = await paymentGateway.createPaymentIntent({
            amount,  // The amount for the order
            currency: 'usd',  // Change the currency as needed
            metadata: {
                packageId,
                packageName: packageDetails.name,
            },
        });

        // Create a new order with "pending" payment status
        const newOrder = new Order({
            userId,
            packageId,
            packageName,
            advertisementId,
            amount,
            paymentStatus: 'pending',
            paymentMethod: 'credit_card',  // Assuming credit card for now
            paymentIntentId: `mock_intent_${Date.now()}`, // Or leave empty if generated later
            userDetails: {
                firstName,
                lastName,
                companyName,
                country,
                addressLine1,
                addressLine2,
                city,
                state,
                zip,
                phone,
                email
            }
        });

        await newOrder.save();

        res.status(201).json({
            message: 'Order created successfully. Proceed to payment.',
            orderId: newOrder._id,
            clientSecret: paymentResponse.client_secret,
        });
    } catch (err) {
        console.error('Checkout Error:', err);
        res.status(500).json({ message: 'Error creating order', error: err.message });
    }
};

module.exports = { checkout };
