const mongoose = require('mongoose');
const { Schema } = mongoose;

const favouritesSchema = new Schema({

    userid: { type: String, required: true },
    advertisementId: { type: String, required: true },
});


const Favourites = mongoose.model('Favourites', favouritesSchema);

module.exports = Favourites;