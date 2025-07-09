const SiteSettings = require('../models/siteSettings');
const Category = require('../models/category');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Normalize and convert paths for frontend
const normalizePath = (filePath) => `${BASE_URL}/${filePath.replace(/\\/g, '/')}`;

// Get current site settings (existing method - keep as is)
exports.getSiteSettings = async (req, res) => {
    try {
        const settings = await SiteSettings.getSiteSettings();
        await settings.populate('homepageCategories.categoryId');

        res.status(200).json(settings);
    } catch (error) {
        console.error('Error fetching site settings:', error);
        res.status(500).json({message: 'Failed to fetch site settings', error: error.message});
    }
};

// Update logo
exports.updateLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({message: 'No logo file provided'});
        }

        const settings = await SiteSettings.getSiteSettings();

        // Delete old logo file if it exists
        if (settings.logo) {
            const oldLogoPath = settings.logo.replace(BASE_URL, '.');
            if (fs.existsSync(oldLogoPath)) {
                fs.unlinkSync(oldLogoPath);
            }
        }

        // Save new logo
        const logoUrl = normalizePath(req.file.path);
        settings.logo = logoUrl;
        settings.logoAlt = req.body.logoAlt || 'Site Logo';
        settings.updatedAt = Date.now();

        await settings.save();

        res.status(200).json({
            message: 'Logo updated successfully',
            logo: settings.logo,
            logoAlt: settings.logoAlt
        });
    } catch (error) {
        console.error('Error updating logo:', error);
        res.status(500).json({message: 'Failed to update logo', error: error.message});
    }
};

// Update favicon
exports.updateFavicon = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({message: 'No favicon file provided'});
        }

        const settings = await SiteSettings.getSiteSettings();

        // Delete old favicon file if it exists
        if (settings.favicon) {
            const oldFaviconPath = settings.favicon.replace(BASE_URL, '.');
            if (fs.existsSync(oldFaviconPath)) {
                fs.unlinkSync(oldFaviconPath);
            }
        }

        // Save new favicon
        const faviconUrl = normalizePath(req.file.path);
        settings.favicon = faviconUrl;
        settings.updatedAt = Date.now();

        await settings.save();

        res.status(200).json({
            message: 'Favicon updated successfully',
            favicon: settings.favicon
        });
    } catch (error) {
        console.error('Error updating favicon:', error);
        res.status(500).json({message: 'Failed to update favicon', error: error.message});
    }
};

// Remove logo
exports.removeLogo = async (req, res) => {
    try {
        const settings = await SiteSettings.getSiteSettings();

        // Delete logo file if it exists
        if (settings.logo) {
            const logoPath = settings.logo.replace(BASE_URL, '.');
            if (fs.existsSync(logoPath)) {
                fs.unlinkSync(logoPath);
            }
        }

        settings.logo = null;
        settings.logoAlt = 'Site Logo';
        settings.updatedAt = Date.now();

        await settings.save();

        res.status(200).json({
            message: 'Logo removed successfully'
        });
    } catch (error) {
        console.error('Error removing logo:', error);
        res.status(500).json({message: 'Failed to remove logo', error: error.message});
    }
};

// Remove favicon
exports.removeFavicon = async (req, res) => {
    try {
        const settings = await SiteSettings.getSiteSettings();

        // Delete favicon file if it exists
        if (settings.favicon) {
            const faviconPath = settings.favicon.replace(BASE_URL, '.');
            if (fs.existsSync(faviconPath)) {
                fs.unlinkSync(faviconPath);
            }
        }

        settings.favicon = null;
        settings.updatedAt = Date.now();

        await settings.save();

        res.status(200).json({
            message: 'Favicon removed successfully'
        });
    } catch (error) {
        console.error('Error removing favicon:', error);
        res.status(500).json({message: 'Failed to remove favicon', error: error.message});
    }
};

// Get public settings (for non-authenticated requests)
exports.getPublicSettings = async (req, res) => {
    try {
        const settings = await SiteSettings.getSiteSettings();

        // Return only public information
        res.status(200).json({
            logo: settings.logo,
            logoAlt: settings.logoAlt,
            favicon: settings.favicon
        });
    } catch (error) {
        console.error('Error fetching public settings:', error);
        res.status(500).json({message: 'Failed to fetch public settings', error: error.message});
    }
};

// Get homepage categories
exports.getHomepageCategories = async (req, res) => {
    try {
        const settings = await SiteSettings.getSiteSettings();
        await settings.populate('homepageCategories.categoryId');

        // Sort by order and return only the populated categories with their order
        const categories = settings.homepageCategories
            .sort((a, b) => a.order - b.order)
            .map(item => ({
                ...item.categoryId.toObject(),
                order: item.order
            }))
            .filter(cat => cat !== null); // Filter out any null categories

        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching homepage categories:', error);
        res.status(500).json({message: 'Failed to fetch homepage categories', error: error.message});
    }
};

// Update homepage categories
exports.updateHomepageCategories = async (req, res) => {
    try {
        const {categories} = req.body; // Array of { categoryId, order }

        // Validate input
        if (!Array.isArray(categories)) {
            return res.status(400).json({message: 'Categories must be an array'});
        }

        if (categories.length > 5) {
            return res.status(400).json({message: 'Maximum 5 categories allowed on homepage'});
        }

        // Validate each category
        for (const cat of categories) {
            if (!cat.categoryId || !cat.order) {
                return res.status(400).json({message: 'Each category must have categoryId and order'});
            }

            // Check if category exists
            const categoryExists = await Category.findById(cat.categoryId);
            if (!categoryExists) {
                return res.status(400).json({message: `Category with ID ${cat.categoryId} not found`});
            }

            // Validate order is between 1 and 5
            if (cat.order < 1 || cat.order > 5) {
                return res.status(400).json({message: 'Category order must be between 1 and 5'});
            }
        }

        // Check for duplicate orders
        const orders = categories.map(cat => cat.order);
        const uniqueOrders = new Set(orders);
        if (orders.length !== uniqueOrders.size) {
            return res.status(400).json({message: 'Each category must have a unique order'});
        }

        // Get current settings
        const settings = await SiteSettings.getSiteSettings();

        // Update homepage categories
        settings.homepageCategories = categories;
        settings.updatedAt = Date.now();

        await settings.save();

        // Populate and return updated settings
        await settings.populate('homepageCategories.categoryId');

        res.status(200).json({
            message: 'Homepage categories updated successfully',
            categories: settings.homepageCategories
        });
    } catch (error) {
        console.error('Error updating homepage categories:', error);
        res.status(500).json({message: 'Failed to update homepage categories', error: error.message});
    }
};

// Add a category to homepage
exports.addHomepageCategory = async (req, res) => {
    try {
        const {categoryId, order} = req.body;

        if (!categoryId || !order) {
            return res.status(400).json({message: 'CategoryId and order are required'});
        }

        // Check if category exists
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({message: 'Category not found'});
        }

        // Get current settings
        const settings = await SiteSettings.getSiteSettings();

        // Check if already at max
        if (settings.homepageCategories.length >= 5) {
            return res.status(400).json({message: 'Maximum 5 categories allowed on homepage'});
        }

        // Check if category already added
        const exists = settings.homepageCategories.some(
            cat => cat.categoryId.toString() === categoryId
        );
        if (exists) {
            return res.status(400).json({message: 'Category already added to homepage'});
        }

        // Check if order is already taken
        const orderTaken = settings.homepageCategories.some(cat => cat.order === order);
        if (orderTaken) {
            return res.status(400).json({message: 'Order position already taken'});
        }

        // Add category
        settings.homepageCategories.push({categoryId, order});
        settings.updatedAt = Date.now();

        await settings.save();

        // Populate and return
        await settings.populate('homepageCategories.categoryId');

        res.status(200).json({
            message: 'Category added to homepage successfully',
            categories: settings.homepageCategories
        });
    } catch (error) {
        console.error('Error adding homepage category:', error);
        res.status(500).json({message: 'Failed to add homepage category', error: error.message});
    }
};

// Remove a category from homepage
exports.removeHomepageCategory = async (req, res) => {
    try {
        const {categoryId} = req.params;

        if (!categoryId) {
            return res.status(400).json({message: 'CategoryId is required'});
        }

        // Get current settings
        const settings = await SiteSettings.getSiteSettings();

        // Find and remove category
        const initialLength = settings.homepageCategories.length;
        settings.homepageCategories = settings.homepageCategories.filter(
            cat => cat.categoryId.toString() !== categoryId
        );

        if (settings.homepageCategories.length === initialLength) {
            return res.status(404).json({message: 'Category not found in homepage settings'});
        }

        settings.updatedAt = Date.now();
        await settings.save();

        // Populate and return
        await settings.populate('homepageCategories.categoryId');

        res.status(200).json({
            message: 'Category removed from homepage successfully',
            categories: settings.homepageCategories
        });
    } catch (error) {
        console.error('Error removing homepage category:', error);
        res.status(500).json({message: 'Failed to remove homepage category', error: error.message});
    }
};

// Reorder homepage categories
exports.reorderHomepageCategories = async (req, res) => {
    try {
        const {categoryOrders} = req.body; // Array of { categoryId, newOrder }

        if (!Array.isArray(categoryOrders)) {
            return res.status(400).json({message: 'categoryOrders must be an array'});
        }

        // Get current settings
        const settings = await SiteSettings.getSiteSettings();

        // Update orders
        for (const orderUpdate of categoryOrders) {
            const categoryIndex = settings.homepageCategories.findIndex(
                cat => cat.categoryId.toString() === orderUpdate.categoryId
            );

            if (categoryIndex !== -1) {
                settings.homepageCategories[categoryIndex].order = orderUpdate.newOrder;
            }
        }

        settings.updatedAt = Date.now();
        await settings.save();

        // Populate and return sorted
        await settings.populate('homepageCategories.categoryId');
        settings.homepageCategories.sort((a, b) => a.order - b.order);

        res.status(200).json({
            message: 'Homepage categories reordered successfully',
            categories: settings.homepageCategories
        });
    } catch (error) {
        console.error('Error reordering homepage categories:', error);
        res.status(500).json({message: 'Failed to reorder homepage categories', error: error.message});
    }
};