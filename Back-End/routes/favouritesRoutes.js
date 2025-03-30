const express=require('express');
const {createFavourites,getAllFavourites,getFavouritesById,deleteFavourite}=require('../controllers/favouriteController');
const router=express.Router();
//Routines
router.post('/',createFavourites);
router.get('/',getAllFavourites);
router.get('/:userid',getFavouritesById);
router.delete('/:userid',deleteFavourite);
module.exports=router;
