const express = require('express');
const { updateUser } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');  // Assuming authMiddleware is used for JWT protection

const router = express.Router();

// Update user details
router.put('/update', authenticate, updateUser); // Protect this route with JWT

// Delete user
router.delete('/delete', authenticate, deleteUser);

module.exports = router;
