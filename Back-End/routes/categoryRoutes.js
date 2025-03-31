const express = require('express');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { isAdmin } = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/',authMiddleware, isAdmin, createCategory); // Only admins can create categories
router.get('/', getCategories); // Anyone can get all categories
router.get('/:id', getCategory); // Anyone can get a category by ID
router.put('/:id', authMiddleware, isAdmin, updateCategory); // Only admins can update categories
router.delete('/:id', authMiddleware, isAdmin, deleteCategory); // Only admins can delete categories

module.exports = router;
