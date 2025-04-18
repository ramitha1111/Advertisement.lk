const express = require('express');
const {
    getUserOrders,
    getOrderById,
    getAllOrders
} = require('../controllers/orderController')
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Admin route
router.get('/', authMiddleware, getAllOrders);

// User routes
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrderById);

module.exports = router;