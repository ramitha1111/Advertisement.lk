const express = require('express');
const {
    createFavourites,
    getAllFavourites,
    deleteFavourite,
    createFavouriteListForUsers,
} = require('../controllers/favouriteController');

const advertisement=require('../controllers/advertisementController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Add favourite
router.post('/', authMiddleware, createFavourites);

// Create favourite list for all users


// Get all favourites
router.get('/', authMiddleware, getAllFavourites);

// Delete favourite
router.delete('/:advertisementId', authMiddleware, deleteFavourite);

module.exports = router;