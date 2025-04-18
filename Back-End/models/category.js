const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    subcategories: [{
        name: {
            type: String,
            required: true
        }
    }],
    features: [{
        name: {
            type: String,
            required: true
        }
    }],
    categoryImage: {
        type: String
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
