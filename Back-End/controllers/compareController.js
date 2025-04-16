const CompareList = require('../models/compare');

// Add Advertisement to Compare List
const addToCompareList = async (req, res) => {
    try {
        // Extract userId from auth token (set by authMiddleware)
        const userId = req.user.id;
        const adId = req.params.id;
        
        let compareList = await CompareList.findOne({ userId });
        
        if (!compareList) {
            compareList = new CompareList({ userId, adIds: [] });
        }
        
        if (!compareList.adIds.includes(adId)) {
            compareList.adIds.push(adId);
            await compareList.save();
        }
        
        res.status(200).json({ message: 'Ad added to compare list', compareList });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to compare list', error });
    }
};

// Remove Advertisement from Compare List
const removeFromCompareList = async (req, res) => {
    try {
        // Extract userId from auth token (set by authMiddleware)
        const userId = req.user.id;
        const adId = req.params.id;
        
        let compareList = await CompareList.findOne({ userId });
        
        if (compareList) {
            compareList.adIds = compareList.adIds.filter(id => id.toString() !== adId);
            await compareList.save();
        }
        
        res.status(200).json({ message: 'Ad removed from compare list', compareList });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from compare list', error });
    }
};

// Get Compared Ads for a User
const getComparedAds = async (req, res) => {
    try {
        // Extract userId from auth token (set by authMiddleware)
        const userId = req.user.id;
        
        const compareList = await CompareList.findOne({ userId }).populate('adIds');
        
        if (!compareList) {
            return res.status(404).json({ message: 'Compare list not found' });
        }
        
        res.status(200).json(compareList.adIds);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching compared ads', error });
    }
};

module.exports = {
    addToCompareList,
    removeFromCompareList,
    getComparedAds
};