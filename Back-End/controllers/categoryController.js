const mongoose = require('mongoose');
const Category = require('../models/category');

// Create Category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = new Category({ name, description });
        await category.save();

        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        console.error('Error in createCategory:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error in getCategories:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Single Category
const getCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is a valid ObjectId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        // Find the category by ID
        const category = await Category.findById(id);

        // If category is not found
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Return the category if found
        res.status(200).json(category);
    } catch (error) {
        console.error('Error in getCategory:', error); // Log the error to the console
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Validate ObjectId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        console.error('Error in updateCategory:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const result = await Category.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory };
