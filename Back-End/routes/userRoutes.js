const express = require('express');
const {
    createAdvertisement,
    getAllAdvertisements,
    updateAdvertisement,
    deleteAdvertisement,
    getAdvertisementsByCategory,
    getAdvertisementsByUserId,
    getAdvertisementsByAdvertisementId,
    getAdvertisementsBySearching,
    getRenewableAds,
    getAdvertisementsByFiltering,
    getUserIdByAdvertisementId
} = require('../controllers/advertisementController');
const authMiddleware = require('../middlewares/authMiddleware');
const routes = express.Router();

// Create advertisement
routes.post('/', authMiddleware, createAdvertisement);

// Get all advertisements
routes.get('/', getAllAdvertisements);

// Get advertisements by user ID (protected route)
routes.get('/user', authMiddleware, getAdvertisementsByUserId);

// Update advertisement (protected)
routes.put('/:id', authMiddleware, updateAdvertisement);

// Delete advertisement (protected)
routes.delete('/:id', authMiddleware, deleteAdvertisement);

// Get advertisements by category
routes.get('/categories/:categoryId', getAdvertisementsByCategory);

// Get advertisements by search keyword
routes.get('/search/:search', getAdvertisementsBySearching);

// Get advertisements by filter parameters
routes.get('/filter/:category?/:location?/:priceRange?', getAdvertisementsByFiltering);

// Get renewable advertisements (protected)
routes.get('/renewable-ads', authMiddleware, getRenewableAds);

// Get user ID by advertisement ID
routes.get('/user-by-ad/:advertisementId', getUserIdByAdvertisementId);

module.exports = routes;