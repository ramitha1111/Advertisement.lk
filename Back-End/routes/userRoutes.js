const express = require('express');
const { updateUser } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');  // Assuming authMiddleware is used for JWT protection
const { getUsers } = require('../controllers/userController');
const { isAdmin } = require('../middlewares/roleMiddleware'); // Assuming you have an admin check

const router = express.Router();

// Update user details
router.put('/update', authenticate, updateUser); // Protect this route with JWT

// Delete user
router.delete('/delete', authenticate, deleteUser);

// Get users - Only accessible to admins
router.get('/', authenticate, isAdmin, getUsers); // Protect this route with JWT and admin verification

module.exports = router;
