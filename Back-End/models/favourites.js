const mongoose = require('mongoose');
const { Schema } = mongoose;

const favouritesSchema = new Schema({

    id: { type: String, required: true },
    userid: { type: String, required: true },
    advertisementId: { type: String, required: true },
    createdAt: { type: Date, required: true }
});


const Favourites = mongoose.model('Favourites', favouritesSchema);

module.exports = Favourites;