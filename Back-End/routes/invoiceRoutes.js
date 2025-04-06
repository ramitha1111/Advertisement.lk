const express = require('express');
const { generateInvoice } = require('../controllers/invoiceController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for generating invoice
router.post('/generate-invoice', authMiddleware, generateInvoice);

module.exports = router;