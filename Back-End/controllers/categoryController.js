const mongoose = require('mongoose');
const Category = require('../models/category');

const createCategory = async (req, res) => {
    try {
        const { name, subcategories, features } = req.body;
        const categoryImage = req.file ? req.file.path : null;

        if (!name) return res.status(400).json({ message: 'Category name is required' });

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) return res.status(400).json({ message: 'Category already exists' });

        const category = new Category({
            name,
            subcategories,
            features,
            categoryImage
        });

        await category.save();

        res.status(201).json({ message: 'Category created', category });
    } catch (error) {
        console.error('Error in createCategory:', error);
        res.status(500).json({ message: 'Server error' });
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
        const { name, subcategories, features } = req.body;
        const categoryImage = req.file ? req.file.path : undefined;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const updateData = { name, subcategories, features };
        if (categoryImage) updateData.categoryImage = categoryImage;

        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        console.error('Error in updateCategory:', error);
        res.status(500).json({ message: 'Server error' });
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
