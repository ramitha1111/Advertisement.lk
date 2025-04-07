const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, getMessageById, deleteMessage } = require("../controllers/contactController");
const { isAdmin } = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes for Contact Form
router.post("/", sendMessage); // Send a message
router.get("/", authMiddleware, isAdmin, getMessages); // Get all messages
router.get("/:id", authMiddleware, isAdmin, getMessageById); // Get a message by ID
router.delete("/:id", authMiddleware, isAdmin, deleteMessage); // Delete a message

module.exports = router;
