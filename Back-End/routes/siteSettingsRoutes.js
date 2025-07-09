const express = require('express');
const {
    getSiteSettings,
    getHomepageCategories,
    updateHomepageCategories,
    addHomepageCategory,
    removeHomepageCategory,
    reorderHomepageCategories,
    getPublicSettings, removeLogo, removeFavicon, updateFavicon, updateLogo
} = require('../controllers/siteSettingsController');
const authMiddleware = require('../middlewares/authMiddleware');
const {isAdmin} = require('../middlewares/roleMiddleware');
const logoUpload = require('../middlewares/logoUpload');

const router = express.Router();

// Public routes - anyone can view homepage categories
router.get('/homepage-categories', getHomepageCategories);
router.get('/public', getPublicSettings);

// Protected routes - admin only
router.get('/', authMiddleware, isAdmin, getSiteSettings);
router.put('/homepage-categories', authMiddleware, isAdmin, updateHomepageCategories);
router.post('/homepage-categories', authMiddleware, isAdmin, addHomepageCategory);
router.delete('/homepage-categories/:categoryId', authMiddleware, isAdmin, removeHomepageCategory);
router.put('/homepage-categories/reorder', authMiddleware, isAdmin, reorderHomepageCategories);

// Logo management routes
router.post('/logo', authMiddleware, isAdmin, logoUpload.single('logo'), updateLogo);
router.delete('/logo', authMiddleware, isAdmin, removeLogo);

// Favicon management routes
router.post('/favicon', authMiddleware, isAdmin, logoUpload.single('favicon'), updateFavicon);
router.delete('/favicon', authMiddleware, isAdmin, removeFavicon);


module.exports = router;
