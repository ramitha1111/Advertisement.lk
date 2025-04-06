const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // Duration in days
    features: { type: [String], required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);

module.exports = Package;
