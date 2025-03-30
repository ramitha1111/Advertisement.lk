const express = require('express');
const router = express.Router();
const { createPackage, getPackages, updatePackage, deletePackage, buyPackage, renewPackage } = require('../controllers/packageController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createPackage);
router.get('/', getPackages);
router.put('/:id', authMiddleware, updatePackage);
router.delete('/:id', authMiddleware, deletePackage);
router.post('/buy/:id', authMiddleware, buyPackage);
router.post('/renew/:id', authMiddleware, renewPackage);

module.exports = router;