const express=require('express');
const {createFavourites,getAllFavourites,getFavouritesById,deleteFavourite}=require('../controllers/favouriteController');
const router=express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

//Routes
router.post('/:advertisementID', authMiddleware, createFavourites);
router.get('/',authMiddleware, getAllFavourites);
router.delete('/:advertisementID',authMiddleware, deleteFavourite);

module.exports=router;
