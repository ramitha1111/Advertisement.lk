const mongoose = require("mongoose");
const advertisementModel = require("../models/advertisement");
const favourites = require("../models/favourites");
const dayjs = require('dayjs');
const Order = require('../models/Order');
const Advertisement = require('../models/Advertisement');
const categoryModel = require('../models/category');
const userModel = require('../models/user');

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

        if (!validateData(req, res)) return; // Stop execution if validation fails

        // Calculate boostedUntil
        const boostDurationMs = 3 * 24 * 60 * 60 * 1000;
        req.body.boostedUntil = new Date(Date.now() + boostDurationMs);

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
        const advertisements = await advertisementModel.find().lean();

        const enrichedAds = await Promise.all(
            advertisements.map(async (ad) => {
                const [category, user] = await Promise.all([
                    categoryModel.findById(ad.categoryId).lean(),
                    userModel.findById(ad.userId).select('username firstName lastName profileImage email phone').lean()
                ]);

                return {
                    ...ad,
                    categoryDetails: category ? {
                        id: category._id,
                        categoryName: category.categoryName
                    } : null,
                    userDetails: user ? {
                        userId: user._id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        profileImage: user.profileImage,
                        email: user.email,
                        phone: user.phone
                    } : null
                };
            })
        );

        res.status(200).json(enrichedAds);
    } catch (error) {
        console.error("Error fetching advertisements:", error);
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
const getCategery=require("./categoryController");
exports.getAdvertisementsByCategory = async (req, res) => {
    try {
        const id=req.params.categoryId;
        //get the categories in to arrays
        console.log(id);
      let name="";
        switch (id) {
            //Fruits
            case 1: name="Fruits";
                    let advertisements = await advertisementModel.find({ name: name });
                    res.status(200).json(advertisements.subCategories);
                    return;
            case 2: name="Electronics";
                     advertisements = await advertisementModel.find({ name: name });
                    res.status(200).json(advertisements.subCategories);
                    return;
            default:
                return res.status(500).json("Error");



        }


    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get advertisements by Advertisement ID
exports.getAdvertisementsByAdvertisementId = async (req, res,next) => {
    try {
        const advertisements = await advertisementModel.findById({ id: req.params.id });
        next(advertisements);

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get advertisements by search keyword (Debounced Search)
exports.getAdvertisementsBySearching = async (req, res) => {
    try {
        const query = req.params.search;
        if (!query) return res.json("Error!,No any data found");
    //Get the InCaseSensitive items by using keyword


        const advertisements = await advertisementModel.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
        }).limit(10); // Limit to 10 results



        res.json({ advertisements });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
//Get Advertisement By Filtering
exports.getAdvertisementsByFiltering = async (req, res) => {
    try {
        const category = req.params.category;
        const location = req.params.location;
        const priceRange = req.params.priceRange;
        console.log(category);
        console.log(location);
        console.log(priceRange);


        if (category || location || priceRange) {
            const filters = {};

            if (category) {
                filters.categoryId = category;
            }

            if (location) {
                filters.location = {$regex: location, $options: "i"}; // Case-insensitive search
            }

            if (priceRange) {
                const [minPrice, maxPrice] = priceRange.split(",").map(Number);
                filters.price = {$gte: minPrice, $lte: maxPrice};
            }

            const advertisements = await advertisementModel.find(filters);
            res.status(200).json(advertisements);
        }
    }
        catch (e) {
        console.error("Error fetching advertisements:", e);
        res.status(500).json({ message: "Server error" });
    }

    }

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
//get userId from advertisementId
exports.getUserIdByAdvertisementId = async (req, res,next) => {
    try {
        const advertisementId = req.params.advertisementId;

        // Find the advertisement by ID
        const advertisement = await advertisementModel.findById(advertisementId);

        if (!advertisement) {
            return res.status(404).json({ message: "Advertisement not found" });
        }

        // Return the userId associated with the advertisement
      next();
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
