
const mongoose= require('mongoose');
const favouritesModel = require('./../models/favourites');
const advertisementModel = require('./../models/advertisement');




// Create a new favourite
exports.createFavourites = async (req, res) => {
    try {
        const advertisementId = req.body.advertisementId;

        const advertisement = await advertisementModel.findOne({ _id: advertisementId });
        if (!advertisement) {
            return res.status(404).json({ message: "Advertisement not found" });
        }

        const userId = req.user.id;
        const categoryId = advertisement.categoryId;
        const subcategoryId = advertisement.subcategoryId;
console.log(userId);
        const existingFavourite = await favouritesModel.findOne({ userId: req.user.userId,_id: advertisementId });
        if (existingFavourite) {
            return res.status(400).json({ message: "Favourite already exists" });
        }

        const newFavourite = new favouritesModel({
            userId,
            advertisementId,
            categoryId,
            subcategoryId,
        });

        console.log(newFavourite);

        await newFavourite.save();
        return res.status(201).json(newFavourite);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};






// Get all favourites
exports.getAllFavourites = async (req, res) => {
    try {
        const favourites = await favouritesModel.findOne({ userId: req.body.userId });
        return res.status(200).json(favourites);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
//New functions

// Delete a favourite by userId and advertisementId
exports.deleteFavourite = async (req, res) => {
    try {

        const userId = req.user.id;
        const advertisementId = req.params.advertisementId;
console.log(userId);
console.log(advertisementId);
        const favourite = await favouritesModel.findOneAndDelete({ userId:userId, advertisementId: advertisementId });

        if (!favourite) {
            return res.status(404).json({ message: "Favourite not found" });
        }

        return res.status(200).json({ message: "Favourite deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
