const express = require('express');
const {
    getUserOrders,
    getOrderById,
    getAllOrders
} = require('../controllers/orderController')
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// User routes
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrderById);

// Admin route
router.get('/all', authMiddleware, getAllOrders);

module.exports = router;