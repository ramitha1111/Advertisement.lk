const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const db = client.db('AdvertisementLk');
const categoriesCollection = db.collection('categories');

// Create Category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const existingCategory = await categoriesCollection.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const result = await categoriesCollection.insertOne({ name, description });

        res.status(201).json({ 
            message: 'Category created successfully', 
            category: { _id: result.insertedId, name, description } 
        });
    } catch (error) {
        console.error('Error in createCategory:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get All Categories
const getCategories = async (req, res) => {
    try {
        const categories = await categoriesCollection.find().toArray();
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
        const category = await categoriesCollection.findOne({ _id: new ObjectId(id) });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Error in getCategory:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const result = await categoriesCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { name, description } },
            { returnDocument: 'after' } // Returns the updated document
        );

        if (!result) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: result });
    } catch (error) {
        console.error('Error in updateCategory:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Delete Category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory };
