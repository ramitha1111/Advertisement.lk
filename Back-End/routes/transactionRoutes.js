const express = require('express');
const {
    createTransaction,
    getAllTransaction,
    getTransactionByUserId
} = require('../controllers/transactionController');

const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

// Create a new transaction (Requires authentication)
router.post('/:packageID', authMiddleware, createTransaction);

// Get all transactions (Admin Only)
router.get('/', authMiddleware, isAdmin, getAllTransaction);

// Get logged-in user's transactions
router.get('/my-transactions', authMiddleware, getTransactionByUserId);

module.exports = router;
