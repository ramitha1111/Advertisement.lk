const Package = require('../models/package');
const User = require('../models/user');
// const Transaction = require('../models/transaction');

// Create a new package
exports.createPackage = async (req, res) => {
    try {
        const { name, price, duration, features } = req.body;
        if (!name || !price || !duration || !features) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newPackage = new Package(req.body);
        const savedPackage = await newPackage.save();
        res.status(201).json(savedPackage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all active packages
exports.getPackages = async (req, res) => {
    try {
        const packages = await Package.find({ isActive: true });
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a package
exports.updatePackage = async (req, res) => {
    try {
        const updatedPackage = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedPackage) return res.status(404).json({ message: 'Package not found' });
        res.status(200).json(updatedPackage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a package
exports.deletePackage = async (req, res) => {
    try {
        const deletedPackage = await Package.findByIdAndDelete(req.params.id);
        if (!deletedPackage) return res.status(404).json({ message: 'Package not found' });
        res.status(200).json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Buy a package
exports.buyPackage = async (req, res) => {
    try {
        const userId = req.user.id;
        const packageId = req.params.id;
        const selectedPackage = await Package.findById(packageId);
        if (!selectedPackage) return res.status(404).json({ message: 'Package not found' });

        await User.findByIdAndUpdate(userId, {
            currentPackage: packageId,
            packageExpiry: new Date(Date.now() + selectedPackage.duration * 86400000),
        });

        // const transaction = new Transaction({ userId, packageId, amount: selectedPackage.price, type: 'purchase' });
        // await transaction.save();

        res.status(200).json({ message: 'Package purchased successfully', selectedPackage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Renew a package
exports.renewPackage = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user || !user.currentPackage) return res.status(400).json({ message: 'No active package to renew' });

        const selectedPackage = await Package.findById(user.currentPackage);
        user.packageExpiry = new Date(user.packageExpiry.getTime() + selectedPackage.duration * 86400000);
        await user.save();

        const transaction = new Transaction({ userId, packageId: user.currentPackage, amount: selectedPackage.price, type: 'renewal' });
        await transaction.save();

        res.status(200).json({ message: 'Package renewed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
