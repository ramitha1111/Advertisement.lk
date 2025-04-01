const express = require('express');
const { createPackage, getAllPackages, getPackageById, getActivePackages, updatePackage, deletePackage, buyPackage, renewPackage } = require('../controllers/packageController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

// This route handles creating a new package
router.post('/', authMiddleware, isAdmin, createPackage);

// This route handles getting all packages
router.get('/', getAllPackages);

// This route handles getting all active packages
router.get('/active', authMiddleware, getActivePackages);

// This route handles getting a single package by ID
router.get('/:id', getPackageById);

// This route handles updating a single package by ID
router.put('/:id', authMiddleware, isAdmin, updatePackage);

// This route handles deleting a package by ID
router.delete('/:id', authMiddleware, isAdmin, deletePackage);

// This route handles buying a package by ID
router.post('/buy/:id', authMiddleware, buyPackage);

// This route handles renewing a package by ID
router.post('/renew/:id', authMiddleware, renewPackage);

module.exports = router;