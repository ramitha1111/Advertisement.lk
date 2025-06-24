const express = require('express');
const {
    createAdvertisement,
    getAllAdvertisements,
    getAdvertisementById,
    updateAdvertisement,
    deleteAdvertisement,
    getAdvertisementsByCategory,
    getAdvertisementsBySubcategory,
    getAdvertisementsByUserId,
    getAdvertisementsBySearching,
    getAdvertisementsByFiltering,
    getAdvertisementsByFavourite,
    getUserIdByAdvertisementId,
    getRenewableAds,
    changeStatus,
    getAllAdvertisementsAdmin,
    getMyAdvertisements,
    getAdvertisementsByUserIdPublic
} = require('../controllers/advertisementController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');
const router = express.Router();

// Public routes
router.get('/', getAllAdvertisements); //
router.get('/admin', authMiddleware, isAdmin, getAllAdvertisementsAdmin);

router.get('/:id', getAdvertisementById); //
router.get('/search/:search', getAdvertisementsBySearching); //
router.get('/filter/:category?/:location?/:priceRange?', getAdvertisementsByFiltering);
router.get('/categories/:categoryId', getAdvertisementsByCategory); //
router.get('/subcategory/:subcategoryId', getAdvertisementsBySubcategory);

// Protected routes (require authentication)
router.post('/', authMiddleware, createAdvertisement); //
router.get('/user/:id', authMiddleware, getAdvertisementsByUserId); //
router.get('/user/public/:userId', getAdvertisementsByUserIdPublic); // for public access
router.get('/my/:id', authMiddleware, getMyAdvertisements); //
router.put('/:id', authMiddleware, updateAdvertisement);
router.delete('/:id', authMiddleware, deleteAdvertisement); //
router.get('/favorites', authMiddleware, getAdvertisementsByFavourite);
router.get('/renewable-ads', authMiddleware, getRenewableAds);
router.get('/user-by-ad/:advertisementId', authMiddleware, getUserIdByAdvertisementId);

// change the status of advertisement
router.get('/change-status/:id', authMiddleware, isAdmin, changeStatus);

module.exports = router;