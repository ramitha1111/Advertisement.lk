const mongoose = require("mongoose");
const advertisementModel = require("../models/advertisement");
const favourites = require("../models/favourites");

// Validate advertisement data
const validateData = (req, res) => {
    const { title, description, price, categoryId, sellerId, location, images, videoUrl } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!description) return res.status(400).json({ message: "Description is required" });
    if (!price) return res.status(400).json({ message: "Price is required" });
    if (!categoryId) return res.status(400).json({ message: "Category is required" });
    if (!sellerId) return res.status(400).json({ message: "Seller is required" });
    if (!location) return res.status(400).json({ message: "Location is required" });
    if (!images) return res.status(400).json({ message: "Images are required" });
    if (!videoUrl) return res.status(400).json({ message: "Video URL is required" });

    return true;
};

// Create advertisement
exports.createAdvertisement = async (req, res) => {
    try {
        if (!validateData(req, res)) return; // Stop execution if validation fails

        const advertisement = new advertisementModel(req.body);
        await advertisement.save();
        res.json({ message: "Advertisement created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get advertisement by ID
exports.getAdvertisements = async (req, res) => {
    try {
        const advertisement = await advertisementModel.findById(req.params.id);
        if (!advertisement) return res.status(404).json({ message: "Advertisement not found" });

        res.status(200).json(advertisement);
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
        if (!validateData(req, res)) return;

        const updatedAdvertisement = await advertisementModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAdvertisement) return res.status(404).json({ message: "Advertisement not found" });

        res.json({ message: "Advertisement updated successfully", advertisement: updatedAdvertisement });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete advertisement
exports.deleteAdvertisement = async (req, res) => {
    try {
        const deletedAd = await advertisementModel.findByIdAndDelete(req.params.id);
        if (!deletedAd) return res.status(404).json({ message: "Advertisement not found" });

        res.json({ message: "Advertisement deleted successfully" });
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
