const express = require('express');
const { createCompare, getAllCompares, getCompareById, deleteCompare } = require('../controllers/compareController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

//Routes
// Add to compare
router.post('/:advertisementID', authMiddleware, createCompare);

// Get all compares
router.get('/:userID', authMiddleware, getAllCompares);

// Delete from compare
router.delete('/:advertisementID', authMiddleware, deleteCompare);

module.exports = router;