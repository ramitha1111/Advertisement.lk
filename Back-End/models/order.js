const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, required: true },
    packageName: { type: String, required: true },
    advertisementId: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, default: 'pending' },
    paymentMethod: { type: String, default: 'credit_card' },
    paymentIntentId: { type: String, required: true },
    userDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        companyName: { type: String, required: false },
        country: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String, required: false },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
}, { timestamps: true });

//Create a model
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

//Export the model
module.exports=Order;