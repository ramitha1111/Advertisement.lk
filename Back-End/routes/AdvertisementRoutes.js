const express=require('express');
const { createAdvertisement, getAdvertisements, getAdvertisement, updateAdvertisement, deleteAdvertisement,
    getAdvertisementsByAdvertisementId,getAdvertisementByCategory,getAdvertisementsBySearch,getCompareAds,addToCompareList,removeFromCompareList
} = require('../controllers/advertisementController');
const routes=express.Router();


routes.post('/', createAdvertisement); // Create advertisement
routes.get('/', getAdvertisements); // Get all advertisements
routes.get('/:id', getAdvertisement); // Get a single advertisement by ID
routes.put('/:id', updateAdvertisement); // Update advertisement
routes.delete('/:id', deleteAdvertisement); // Delete advertisement
routes.get('/:categories',getAdvertisementByCategory);//Get advertisements by category , make an adjustment by Mihiran on this line 
routes.get('/:advertisementId',getAdvertisementsByAdvertisementId);//Get advertisements by id
routes.get('/:search',getAdvertisementsBySearch);//Get advertisements by search
routes.post('/compare/:id',addToCompareList); // Add ad to compare list
routes.delete('/compare/:id',removeFromCompareList);//remove ad from compare list 
routes.get('/compare',getCompareAds);// Get compared Ads


module.exports=routes;


