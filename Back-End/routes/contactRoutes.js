const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, getMessageById, deleteMessage } = require("../controllers/contactController");
const { isAdmin } = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes for Contact Form
router.post("/contact", sendMessage); // Send a message
router.get("/contact", authMiddleware, isAdmin, getMessages); // Get all messages
router.get("/contact/:id", authMiddleware, isAdmin, getMessageById); // Get a message by ID
router.delete("/contact/:id", authMiddleware, isAdmin, deleteMessage); // Delete a message

module.exports = router;
