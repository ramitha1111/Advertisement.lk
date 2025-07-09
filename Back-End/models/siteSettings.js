const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
    homepageCategories: [{
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        order: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    }],
    // Add logo fields
    logo: {
        type: String,
        default: null // URL to the logo image
    },
    logoAlt: {
        type: String,
        default: 'Site Logo'
    },
    favicon: {
        type: String,
        default: null // URL to the favicon
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure only one site settings document exists
siteSettingsSchema.statics.getSiteSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({
            homepageCategories: [],
            logo: null,
            logoAlt: 'Site Logo',
            favicon: null
        });
    }
    return settings;
};

// Validate that we don't exceed 5 categories
siteSettingsSchema.pre('save', function (next) {
    if (this.homepageCategories.length > 5) {
        next(new Error('Maximum 5 categories allowed on homepage'));
    } else {
        next();
    }
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

module.exports = SiteSettings;