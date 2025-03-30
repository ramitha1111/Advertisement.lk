const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    duration: {type: Number, required: true}, // Duration in days
    features: {type: [String], required: true},
    isActive: {type: Boolean, default: true}
}, {timestamps: true});

module.exports = mongoose.model('Package', PackageSchema);