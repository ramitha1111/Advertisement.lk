const express = require('express');
const {
    getUserOrders,
    getOrderById,
    getAllOrders
} = require('../controllers/orderController')
const isAuthenticated = require('../middlewares/authMiddleware');

const router = express.Router();

// User routes
router.get('/my-orders', isAuthenticated, getUserOrders);
router.get('/:id', isAuthenticated, getOrderById);

// Admin route
router.get('/all', isAuthenticated, getAllOrders);

module.exports = router;