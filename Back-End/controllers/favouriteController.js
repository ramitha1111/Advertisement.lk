const mongoose= require('mongoose');
const favouritesModel = require('./../models/favourites');
const advertisementModel = require('./../models/advertisement');

// Create a new favourite
exports.createFavourites = async (req, res) => {
    try {
        const userId = req.user.id;
        const advertisementId = req.params.id;

        const advertisement = await advertisementModel.findOne({ _id: advertisementId });
        if (!advertisement) {
            return res.status(404).json({ message: "Advertisement not found" });
        }

        const existingFavourite = await favouritesModel.findOne({ "userId": userId, "advertisementId": advertisementId });
        if (existingFavourite) {
            return res.status(400).json({ message: "Favourite already exists" });
        }

        const newFavourite = new favouritesModel({
            userId,
            advertisementId,
        });

        await newFavourite.save();
        return res.status(200).json({
            message: "Favourite created successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Get all favourites
exports.getAllFavourites = async (req, res) => {
    try {
        const userId = req.params.id;
        const favourites = await favouritesModel.find({ userId: userId});
        return res.status(200).json(favourites);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Delete a favourite by userId and advertisementId
exports.deleteFavourite = async (req, res) => {
    try {
        const userId = req.user.id;
        const advertisementId = req.params.id;

        const favourite = await favouritesModel.findOneAndDelete({ "userId" :userId, "advertisementId": advertisementId });

        if (!favourite) {
            return res.status(404).json({ message: "Favourite not found" });
        }

        return res.status(200).json({ message: "Favourite deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
