const mongoose = require('mongoose');
const { Schema } = mongoose;

const favouritesSchema = new Schema({

    userId: { type: String, required: true },
    advertisementId: { type: String, required: true },
    categoryId: { type: String, required: true },
    subcategoryId: { type: String, required: true },

});


const Favourites = mongoose.model('Favourites', favouritesSchema);

module.exports = Favourites;