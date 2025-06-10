const express = require('express');
const {
    getSiteSettings,
    getHomepageCategories,
    updateHomepageCategories,
    addHomepageCategory,
    removeHomepageCategory,
    reorderHomepageCategories
} = require('../controllers/siteSettingsController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public routes - anyone can view homepage categories
router.get('/homepage-categories', getHomepageCategories);

// Protected routes - admin only
router.get('/', authMiddleware, isAdmin, getSiteSettings);
router.put('/homepage-categories', authMiddleware, isAdmin, updateHomepageCategories);
router.post('/homepage-categories', authMiddleware, isAdmin, addHomepageCategory);
router.delete('/homepage-categories/:categoryId', authMiddleware, isAdmin, removeHomepageCategory);
router.put('/homepage-categories/reorder', authMiddleware, isAdmin, reorderHomepageCategories);

module.exports = router;
