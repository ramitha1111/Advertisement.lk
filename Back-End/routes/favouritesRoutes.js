const express=require('express');
const {createFavourites,getAllFavourites,getFavouritesById,deleteFavourite}=require('../controllers/favouriteController');
const router=express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

//Routes
// Add favourite
router.post('/:advertisementID', authMiddleware, createFavourites);

// Get all favourites
router.get('/:userID',authMiddleware, getAllFavourites);

// Delete favourite
router.delete('/:advertisementID',authMiddleware, deleteFavourite);

module.exports=router;
