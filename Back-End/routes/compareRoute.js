const express = require('express');
const { createCompare, getAllCompares, deleteCompare } = require('../controllers/compareController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

//Routes
// Add to compare
router.post('/:id', authMiddleware, createCompare);

// Get all compares
router.get('/', authMiddleware, getAllCompares);

// Delete from compare
router.delete('/:id', authMiddleware, deleteCompare);

module.exports = router;