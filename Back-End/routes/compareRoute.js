const express = require('express');
const { createCompare, getAllCompares, deleteCompare } = require('../controllers/compareController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

//Routes
// Add to compare
router.post('/', authMiddleware, createCompare);

// Get all compares
router.get('/:id', authMiddleware, getAllCompares);

// Delete from compare
router.delete('/:id/:userId', authMiddleware, deleteCompare);

module.exports = router;