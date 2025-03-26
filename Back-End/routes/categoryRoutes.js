const express = require('express');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

const router = express.Router();

router.post('/', createCategory); // Create category
router.get('/', getCategories); // Get all categories
router.get('/:id', getCategory); // Get a single category by ID
router.put('/:id', updateCategory); // Update category
router.delete('/:id', deleteCategory); // Delete category

module.exports = router;
