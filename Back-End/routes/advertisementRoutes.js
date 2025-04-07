const express=require('express');

const { createAdvertisement, getAllAdvertisements,updateAdvertisement, deleteAdvertisement,
    getAdvertisementsByCategory,getAdvertisementsByUserId,
    getAdvertisementsByAdvertisementId, getAdvertisementsBySearching
} = require('../controllers/advertisementController');
const routes=express.Router();
const authMiddleware = require('../middlewares/authMiddleware');


routes.post('/', authMiddleware,createAdvertisement); // Create advertisement
routes.get('/', getAllAdvertisements); // Get all advertisements

routes.get('/user/',authMiddleware, getAdvertisementsByUserId); // Get a single advertisement by userID
routes.put('/:id',authMiddleware, updateAdvertisement); // Update advertisement
routes.delete('/info/:id',authMiddleware, deleteAdvertisement); // Delete advertisement
routes.get('/:categories', getAdvertisementsByCategory);//Get advertisements by category
routes.get('/:advertisementId',getAdvertisementsByAdvertisementId);//Get advertisements by id
routes.get('/search/:search',getAdvertisementsBySearching);//Get advertisements by search


module.exports=routes;