const express=require('express');
const { createAdvertisement, getAllAdvertisements, getAdvertisements, updateAdvertisement, deleteAdvertisement,
    getAdvertisementsByCategory, getAdvertisementsByAdvertisementId, getAdvertisementsBySearching
} = require('../controllers/advertisementController');
const routes=express.Router();
const authMiddleware = require('../middlewares/authMiddleware');


routes.post('/', createAdvertisement); // Create advertisement
routes.get('/', getAllAdvertisements); // Get all advertisements
routes.get('/:id', getAdvertisements); // Get a single advertisement by ID
routes.put('/:id', updateAdvertisement); // Update advertisement
routes.delete('/:id', deleteAdvertisement); // Delete advertisement
routes.get('/:categories', getAdvertisementsByCategory);//Get advertisements by category
routes.get('/:advertisementId',getAdvertisementsByAdvertisementId);//Get advertisements by id
routes.get('/search/:search',getAdvertisementsBySearching);//Get advertisements by search


module.exports=routes;


