const mongoose = require("mongoose");
const advertisementModel = require("../models/advertisement");
const favourites = require("../models/favourites");
const dayjs = require('dayjs');
const Order = require('../models/Order');
const Advertisement = require('../models/Advertisement');

// Validate advertisement data
const validateData = (req, res) => {
    const { title, description, price, categoryId, location, images, videoUrl,subcategoryId } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!description) return res.status(400).json({ message: "Description is required" });
    if (!price) return res.status(400).json({ message: "Price is required" });
    if (!categoryId) return res.status(400).json({ message: "Category is required" });

    if (!location) return res.status(400).json({ message: "Location is required" });
    if (!images) return res.status(400).json({ message: "Images are required" });
    if (!videoUrl) return res.status(400).json({ message: "Video URL is required" });
    if(!subcategoryId) return res.status(400).json({ message: "Subcategory is required" });
    return true;
};

// Create advertisement
exports.createAdvertisement = async (req, res) => {
    try {
        // Check if the user is authenticated
        req.body.userId=req.user.id;
        //Those additional Values which kept in db as default value
        req.body.createdAt = new Date();
        req.body.updatedAt = req.body.createdAt;
        req.body.isBoosted = 0;
console.log(req.user.userId);

        if (!validateData(req, res)) return; // Stop execution if validation fails

        const advertisement = new advertisementModel(req.body);

       //save advertisement in db
        await advertisement.save();

        res.json({ message: "Advertisement created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get advertisement by userId
exports.getAdvertisementsByUserId = async (req, res) => {
    try {
      // get the UserId by authMiddleware
        const userId = req.user.id;
        console.log(userId);

        //find advertisements by userId
        //It will return all advertisements of the user
        const advertisements = await advertisementModel.find({ userId: userId});
       //Pass the Parameter for filter the advertisement want to delete


        //Delete the advertisement by advertisementId


        if (!advertisements) return res.status(404).json({ message: "Advertisement not found" });
        // Check if the advertisement belongs to the user
        console.log(advertisements.toString());
        res.status(200).json(advertisements);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get all advertisements
exports.getAllAdvertisements = async (req, res) => {
    try {
        const advertisements = await advertisementModel.find();
        res.status(200).json(advertisements);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update advertisement
exports.updateAdvertisement = async (req, res) => {
    try {
        req.body.updatedAt = new Date();
        if (!validateData(req, res)) return;

        const updatedAdvertisement = await advertisementModel.findByIdAndUpdate(req.id, req.body, { new: true });
        if (!updatedAdvertisement) return res.status(404).json({ message: "Advertisement not found" });

        res.json({ message: "Advertisement updated successfully", advertisement: updatedAdvertisement });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete advertisement
exports.deleteAdvertisement = async (req, res) => {
    try {
        const userId=req.user.id;
        const advertisementId=req.params.id;
        const advertisement = await advertisementModel.findOne({userId: userId,_id: advertisementId});
        console.log(advertisement);
        // Check if the advertisement belongs to the user
        if (!advertisement) return res.status(404).json({ message: "Advertisement not found" });
        await advertisement.deleteOne();
        res.status(200).json({ message: "Advertisement deleted successfully" });
        console.log(advertisement.toString());
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get advertisements by category
exports.getAdvertisementsByCategory = async (req, res) => {
    try {
        const advertisements = await advertisementModel.find({ categoryId: req.params.categoryId });
        res.status(200).json(advertisements);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get advertisements by Advertisement ID
exports.getAdvertisementsByAdvertisementId = async (req, res) => {
    try {
        const advertisements = await advertisementModel.find({ id: req.params.id });
        res.status(200).json(advertisements);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get advertisements by search keyword (Debounced Search)
exports.getAdvertisementsBySearching = async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.json({ advertisements: [] });

        const advertisements = await advertisementModel.find({
            $text: { $search: query },
        }).limit(10); // Optimized search with a limit

        res.json({ advertisements });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get advertisements by user's favorite list
exports.getAdvertisementsByFavourite = async (req, res) => {
    try {
        const favouriteAds = await favourites.findOne({ userId: req.params.userId });
        if (!favouriteAds) return res.status(404).json({ message: "No favorites found for this user" });

        res.status(200).json(favouriteAds);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get renewable ads

exports.getRenewableAds = async (req, res) => {
    const userId = req.user.id; // Extracted from token via authMiddleware

    try {
        // Get orders for the current user
        const orders = await Order.find({ userId });

        // Extract advertisementIds from orders and ensure they are ObjectIds
        const adIds = orders.map(order => order.advertisementId);

        // Ensure adIds contains only valid ObjectId values
        if (!adIds.length) {
            return res.status(400).json({ message: 'No advertisements found for this user' });
        }

        // Get the current time and the time 1 day from now
        const tomorrowStart = dayjs().add(1, 'day').startOf('day').toDate();
        const tomorrowEnd = dayjs().add(1, 'day').endOf('day').toDate();

        // Find ads that are boosted and will expire in 1 day
        const renewableAds = await Advertisement.find({
            _id: { $in: adIds },  // Ensure adIds are ObjectId types
            isBoosted: 1,  // Ads that are boosted
            boostedUntil: {
                $gte: tomorrowStart,
                $lte: tomorrowEnd
            }
        }).select('_id packageId boostedUntil'); // Select adId and packageId only

        // Return the filtered ads
        res.status(200).json({ renewableAds });
    } catch (err) {
        console.error('Error fetching renewable ads:', err);
        res.status(500).json({ message: 'Failed to fetch renewable ads', error: err.message });
    }
};
