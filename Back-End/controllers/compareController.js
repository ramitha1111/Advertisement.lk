// controllers/compareController.js
const mongoose = require('mongoose');
const CompareList = require('../models/compare');

// Add Advertisement to Compare List (max 2 ads)
const createCompare = async (req, res) => {
    try {
        const userId = req.body.userId;
        const adId = new mongoose.Types.ObjectId(req.body.advertisementId);

        let compareList = await CompareList.findOne({ userId });

        if (!compareList) {
            compareList = new CompareList({ userId, adIds: [] });
        }

        const alreadyExists = compareList.adIds.some(id => id.equals(adId));
        if (!alreadyExists) {
            if (compareList.adIds.length === 2) {
                compareList.adIds.shift();
            }
            compareList.adIds.push(adId);
            await compareList.save();
        }

        res.status(200).json({ message: 'Ad added to compare list', compareList });
    } catch (error) {
        console.error('Error adding to compare list:', error);
        res.status(500).json({ message: 'Error adding to compare list', error: error.message });
    }
};

// Remove Advertisement from Compare List
const deleteCompare = async (req, res) => {
    try {
        const adId = req.params.id;
        const userId = req.params.userId;

        const compareList = await CompareList.findOne({ userId });

        if (!compareList) {
            return res.status(404).json({ message: 'Compare list not found' });
        }

        const updatedAdIds = compareList.adIds.filter(id => id.toString() !== adId);

        compareList.adIds = updatedAdIds;
        await compareList.save();

        res.status(200).json({ message: 'Ad removed from compare list', compareList });
    } catch (error) {
        console.error('Error removing from compare list:', error);
        res.status(500).json({ message: 'Error removing from compare list', error: error.message });
    }
};

// Get Compared Ads for a User
const getAllCompares = async (req, res) => {
    try {
        const userId = req.params.id;

        const compareList = await CompareList.findOne({ userId }).populate('adIds');

        if (!compareList || compareList.adIds.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(compareList.adIds);
    } catch (error) {
        console.error('Error fetching compared ads:', error);
        res.status(500).json({ message: 'Error fetching compared ads', error: error.message });
    }
};

module.exports = {
    createCompare,
    deleteCompare,
    getAllCompares
};