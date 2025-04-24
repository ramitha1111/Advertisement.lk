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
router.post('/:id', authMiddleware, createFavourites);

// Create favourite list for all users


// Get all favourites
router.get('/:id', authMiddleware, getAllFavourites);

// Delete favourite
router.delete('/:id', authMiddleware, deleteFavourite);

module.exports = router;