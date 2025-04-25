const mongoose = require('mongoose');
const { Schema } = mongoose;

const favouritesSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  },
    advertisementId:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Advertisement' }],

});


const Favourites = mongoose.model('Favourites', favouritesSchema);

module.exports = Favourites;