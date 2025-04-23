const CompareList = require('../models/compare');

// Add Advertisement to Compare List (max 2 ads)
const createCompare = async (req, res) => {
    try {
        const userId = req.user.id;
        const adId = req.params.id;

        let compareList = await CompareList.findOne({ userId });

        if (!compareList) {
            compareList = new CompareList({ userId, adIds: [] });
        }

        // If ad is already in list, don't add again
        if (!compareList.adIds.includes(adId)) {
            // If already 2 ads, remove the first one
            if (compareList.adIds.length === 2) {
                compareList.adIds.shift(); // removes the first (oldest) ad
            }

            compareList.adIds.push(adId); // add new ad
            await compareList.save();
        }

        res.status(200).json({ message: 'Ad added to compare list', compareList });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to compare list', error });
    }
};


// Remove Advertisement from Compare List
const deleteCompare = async (req, res) => {
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
const getAllCompares = async (req, res) => {
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
    createCompare,
    deleteCompare,
    getAllCompares
};