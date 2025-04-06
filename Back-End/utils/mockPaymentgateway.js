// utils/mockPaymentGateway.js

const mockPaymentGateway = {
    createPaymentIntent: async ({ amount, currency, metadata }) => {
        // Simulate payment intent creation
        return {
            id: 'mock_payment_intent_' + Date.now(),
            client_secret: 'mock_client_secret_' + Date.now(),
            amount,
            currency,
            metadata,
        };
    },

    verifyPayment: async (paymentId, paymentIntentId) => {
        // Simulate successful payment verification
        return {
            status: 'succeeded',
            paymentId,
            paymentIntentId,
        };
    },
};

module.exports = mockPaymentGateway;
