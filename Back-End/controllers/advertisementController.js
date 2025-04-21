const mongoose = require("mongoose");
const Advertisement = require("../models/Advertisement");
const Category = require("../models/category");
const User = require("../models/User");
const Favourites = require("../models/favourites");
const dayjs = require('dayjs');
const Order = require('../models/Order');
const upload = require('../middlewares/upload');

// Multer middleware for image uploads
const handleFileUploads = upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);

// Validate advertisement data
const validateData = (req, res) => {
    const {
        title,
        description,
        price,
        categoryId,
        subcategoryId,
        location,
        videoUrl,
        features
    } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!description) return res.status(400).json({ message: "Description is required" });
    if (!price) return res.status(400).json({ message: "Price is required" });
    if (!categoryId) return res.status(400).json({ message: "Category is required" });
    if (!subcategoryId) return res.status(400).json({ message: "Subcategory is required" });
    if (!location) return res.status(400).json({ message: "Location is required" });
    if (!videoUrl) return res.status(400).json({ message: "Video URL is required" });
    //if (!features || !Array.isArray(features) || features.length === 0)
        //return res.status(400).json({ message: "At least one feature is required" });

    return true;
};

// Enrich advertisement with category and user details
const enrichAdvertisement = async (ad) => {
    const [category, user] = await Promise.all([
        Category.findById(ad.categoryId).lean(),
        User.findById(ad.userId).select('username firstName lastName profileImage email phone').lean()
    ]);

    return {
        ...ad,
        categoryDetails: category ? {
            id: category._id,
            categoryName: category.name
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
};

// Create advertisement
exports.createAdvertisement = [
    handleFileUploads,
    async (req, res) => {
        try {
            // Process file uploads
            if (!req.files || !req.files.featuredImage) {
                return res.status(400).json({ message: "Featured image is required" });
            }

            // Add file paths to req.body
            req.body.featuredImage = req.files.featuredImage[0].path;
            req.body.images = req.files.images ? req.files.images.map(file => file.path) : [];

            // Set default values
            req.body.userId = req.user.id;
            req.body.createdAt = new Date();
            req.body.updatedAt = req.body.createdAt;
            req.body.isBoosted = 0;
            req.body.views = "0";
            req.body.status = "active";
            req.body.isVisible = 1;

            // Parse features array if it's sent as JSON string
            if (typeof req.body.features === 'string') {
                try {
                    req.body.features = JSON.parse(req.body.features);
                } catch (e) {
                    req.body.features = [req.body.features]; // Convert to array if single string
                }
            }

            if (!validateData(req, res)) return; // Stop execution if validation fails

            // Calculate boostedUntil
            const boostDurationMs = 3 * 24 * 60 * 60 * 1000;
            req.body.boostedUntil = new Date(Date.now() + boostDurationMs);

            const advertisement = new Advertisement(req.body);

            //save advertisement in db
            await advertisement.save();

            res.status(201).json({
                message: "Advertisement created successfully",
                advertisementId: advertisement._id
            });
        } catch (error) {
            console.error('Error creating advertisement:', error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
];

// Get advertisement by userId
exports.getAdvertisementsByUserId = async (req, res) => {
    try {
        // Get the UserId from authMiddleware
        const userId = req.user.id;

        // Find advertisements by userId
        const advertisements = await Advertisement.find({ userId }).lean();

        if (!advertisements || advertisements.length === 0) {
            return res.status(404).json({ message: "No advertisements found for this user" });
        }

        // Enrich advertisements with category and user details
        const enrichedAds = await Promise.all(
            advertisements.map(ad => enrichAdvertisement(ad))
        );

        res.status(200).json(enrichedAds);
    } catch (error) {
        console.error('Error getting user advertisements:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all advertisements
exports.getAllAdvertisements = async (req, res) => {
    try {
        const advertisements = await Advertisement.find().lean();

        const enrichedAds = await Promise.all(
            advertisements.map(ad => enrichAdvertisement(ad))
        );

        res.status(200).json(enrichedAds);
    } catch (error) {
        console.error('Error getting all advertisements:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get advertisement by ID
exports.getAdvertisementById = async (req, res) => {
    try {
        const advertisementId = req.params.id;

        // Find advertisement by ID
        const advertisement = await Advertisement.findById(advertisementId).lean();

        if (!advertisement) {
            return res.status(404).json({ message: "Advertisement not found" });
        }

        // Increment view count
        await Advertisement.findByIdAndUpdate(
            advertisementId,
            { $set: { views: (parseInt(advertisement.views) + 1).toString() } }
        );

        // Enrich advertisement with category and user details
        const enrichedAd = await enrichAdvertisement(advertisement);

        res.status(200).json(enrichedAd);
    } catch (error) {
        console.error('Error getting advertisement by ID:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update advertisement
exports.updateAdvertisement = [
    handleFileUploads,
    async (req, res) => {
        try {
            const advertisementId = req.params.id;
            const userId = req.user.id;

            // Find the advertisement by ID and user ID
            const advertisement = await Advertisement.findOne({
                _id: advertisementId,
                userId
            });

            if (!advertisement) {
                return res.status(404).json({ message: "Advertisement not found or not owned by this user" });
            }

            req.body.updatedAt = new Date();

            // Process file uploads if any
            if (req.files) {
                if (req.files.featuredImage) {
                    req.body.featuredImage = req.files.featuredImage[0].path;
                }

                if (req.files.images && req.files.images.length > 0) {
                    req.body.images = req.files.images.map(file => file.path);
                }
            }

            // Parse features array if it's sent as JSON string
            if (typeof req.body.features === 'string') {
                try {
                    req.body.features = JSON.parse(req.body.features);
                } catch (e) {
                    req.body.features = [req.body.features]; // Convert to array if single string
                }
            }

            if (!validateData(req, res)) return; // Stop execution if validation fails

            const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
                advertisementId,
                { $set: req.body },
                { new: true }
            );

            if (!updatedAdvertisement) {
                return res.status(404).json({ message: "Advertisement not found" });
            }

            res.json({
                message: "Advertisement updated successfully",
                advertisement: updatedAdvertisement
            });
        } catch (error) {
            console.error('Error updating advertisement:', error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
];

// Delete advertisement
exports.deleteAdvertisement = async (req, res) => {
    try {
        const userId = req.user.id;
        const advertisementId = req.params.id;

        const advertisement = await Advertisement.findOne({
            userId,
            _id: advertisementId
        });

        if (!advertisement) {
            return res.status(404).json({ message: "Advertisement not found or not owned by this user" });
        }

        await advertisement.deleteOne();

        res.status(200).json({ message: "Advertisement deleted successfully" });
    } catch (error) {
        console.error('Error deleting advertisement:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get advertisements by category
exports.getAdvertisementsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        // Find advertisements by category ID
        const advertisements = await Advertisement.find({
            categoryId,
            isVisible: 1
        }).lean();

        if (!advertisements || advertisements.length === 0) {
            return res.status(404).json({ message: "No advertisements found for this category" });
        }

        // Enrich advertisements with category and user details
        const enrichedAds = await Promise.all(
            advertisements.map(ad => enrichAdvertisement(ad))
        );

        res.status(200).json(enrichedAds);
    } catch (error) {
        console.error('Error getting advertisements by category:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get advertisements by subcategory
exports.getAdvertisementsBySubcategory = async (req, res) => {
    try {
        const subcategoryId = req.params.subcategoryId;

        // Find advertisements by subcategory ID
        const advertisements = await Advertisement.find({
            subcategoryId,
            isVisible: 1
        }).lean();

        if (!advertisements || advertisements.length === 0) {
            return res.status(404).json({ message: "No advertisements found for this subcategory" });
        }

        // Enrich advertisements with category and user details
        const enrichedAds = await Promise.all(
            advertisements.map(ad => enrichAdvertisement(ad))
        );

        res.status(200).json(enrichedAds);
    } catch (error) {
        console.error('Error getting advertisements by subcategory:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get advertisements by search keyword
exports.getAdvertisementsBySearching = async (req, res) => {
    try {
        const query = req.params.search;

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Find advertisements by title or description
        const advertisements = await Advertisement.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
            isVisible: 1
        }).limit(10).lean();

        if (!advertisements || advertisements.length === 0) {
            return res.status(404).json({ message: "No advertisements found matching your search" });
        }

        // Enrich advertisements with category and user details
        const enrichedAds = await Promise.all(
            advertisements.map(ad => enrichAdvertisement(ad))
        );

        res.status(200).json({ advertisements: enrichedAds });
    } catch (error) {
        console.error('Error searching advertisements:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get advertisements by filtering
exports.getAdvertisementsByFiltering = async (req, res) => {
    try {
        const category = req.params.category;
        const location = req.params.location;
        const priceRange = req.params.priceRange;

        const filters = { isVisible: 1 };

        if (category && category !== 'all') {
            filters.categoryId = category;
        }

        if (location && location !== 'all') {
            filters.location = { $regex: location, $options: "i" };
        }

        if (priceRange && priceRange !== 'all') {
            const [minPrice, maxPrice] = priceRange.split(",").map(Number);
            filters.price = { $gte: minPrice, $lte: maxPrice };
        }

        const advertisements = await Advertisement.find(filters).lean();

        if (!advertisements || advertisements.length === 0) {
            return res.status(404).json({ message: "No advertisements found matching your filters" });
        }

        // Enrich advertisements with category and user details
        const enrichedAds = await Promise.all(
            advertisements.map(ad => enrichAdvertisement(ad))
        );

        res.status(200).json(enrichedAds);
    } catch (error) {
        console.error('Error filtering advertisements:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get advertisements by user's favorite list
exports.getAdvertisementsByFavourite = async (req, res) => {
    try {
        const userId = req.user.id;

        const userFavourites = await Favourites.findOne({ userId });

        if (!userFavourites || !userFavourites.advertisements || userFavourites.advertisements.length === 0) {
            return res.status(404).json({ message: "No favorites found for this user" });
        }

        // Find all advertisements in the user's favorites
        const advertisements = await Advertisement.find({
            _id: { $in: userFavourites.advertisements },
            isVisible: 1
        }).lean();

        if (!advertisements || advertisements.length === 0) {
            return res.status(404).json({ message: "No valid advertisements found in favorites" });
        }

        // Enrich advertisements with category and user details
        const enrichedAds = await Promise.all(
            advertisements.map(ad => enrichAdvertisement(ad))
        );

        res.status(200).json(enrichedAds);
    } catch (error) {
        console.error('Error getting favorite advertisements:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get userId from advertisementId
exports.getUserIdByAdvertisementId = async (req, res) => {
    try {
        const advertisementId = req.params.advertisementId;

        const advertisement = await Advertisement.findById(advertisementId);

        if (!advertisement) {
            return res.status(404).json({ message: "Advertisement not found" });
        }

        res.status(200).json({ userId: advertisement.userId });
    } catch (error) {
        console.error('Error getting user ID by advertisement ID:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get renewable ads
exports.getRenewableAds = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get orders for the current user
        const orders = await Order.find({ userId });

        // Extract advertisementIds from orders
        const adIds = orders.map(order => order.advertisementId);

        if (!adIds.length) {
            return res.status(404).json({ message: 'No advertisements found for this user' });
        }

        // Get the current time and the time 1 day from now
        const tomorrowStart = dayjs().add(1, 'day').startOf('day').toDate();
        const tomorrowEnd = dayjs().add(1, 'day').endOf('day').toDate();

        // Find ads that are boosted and will expire in 1 day
        const renewableAds = await Advertisement.find({
            _id: { $in: adIds },
            isBoosted: 1,
            boostedUntil: {
                $gte: tomorrowStart,
                $lte: tomorrowEnd
            }
        }).select('_id title featuredImage packageId boostedUntil').lean();

        if (!renewableAds || renewableAds.length === 0) {
            return res.status(404).json({ message: 'No renewable ads found' });
        }

        res.status(200).json({ renewableAds });
    } catch (error) {
        console.error('Error fetching renewable ads:', error);
        res.status(500).json({ message: 'Failed to fetch renewable ads', error: error.message });
    }
};