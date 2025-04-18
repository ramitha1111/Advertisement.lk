const express = require('express');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { isAdmin } = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/', authMiddleware, isAdmin, upload.single('categoryImage'), createCategory);
router.get('/', getCategories);
router.get('/:id', getCategory);
router.put('/:id', authMiddleware, isAdmin, upload.single('categoryImage'), updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);

module.exports = router;
