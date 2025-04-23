const mongoose = require('mongoose');
const Category = require('../models/category');

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";


const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        // Normalize category image path
        const normalizePath = (filePath) => `${BASE_URL}/${filePath.replace(/\\/g, '/')}`;
        const categoryImage = req.file ? normalizePath(req.file.path) : null;

        // Parse subcategories if provided
        let subcategories = [];
        if (typeof req.body.subcategories === 'string') {
            try {
                subcategories = JSON.parse(req.body.subcategories);
            } catch (e) {
                subcategories = [{ name: req.body.subcategories }];
            }
        }

        // Parse features if provided
        let features = [];
        if (typeof req.body.features === 'string') {
            try {
                features = JSON.parse(req.body.features);
            } catch (e) {
                features = [{ name: req.body.features }];
            }
        }

        const category = new Category({
            name,
            subcategories,
            features,
            categoryImage
        });

        await category.save();

        res.status(200).json({ message: 'Category created successfully', category });

    } catch (error) {
        console.error('Error in createCategory:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error in getCategories:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid category ID' });

        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json(category);
    } catch (error) {
        console.error('Error in getCategory:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        let { name, subcategories, features } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        // Normalize image path if uploaded
        const normalizePath = (filePath) => `${BASE_URL}/${filePath.replace(/\\/g, '/')}`;
        const categoryImage = req.file ? normalizePath(req.file.path) : undefined;

        // Parse subcategories if needed
        if (typeof subcategories === 'string') {
            try {
                subcategories = JSON.parse(subcategories);
            } catch {
                subcategories = [{ name: subcategories }];
            }
        }

        // Parse features if needed
        if (typeof features === 'string') {
            try {
                features = JSON.parse(features);
            } catch {
                features = [{ name: features }];
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (subcategories) updateData.subcategories = subcategories;
        if (features) updateData.features = features;
        if (categoryImage) updateData.categoryImage = categoryImage;

        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });

    } catch (error) {
        console.error('Error in updateCategory:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid category ID' });

        const result = await Category.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory };
