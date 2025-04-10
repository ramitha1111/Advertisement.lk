const express = require('express');
const { 
  updateUser, 
  getUsers, 
  getUserById, 
  deleteUser, 
  createUser, 
  createAdmin, // Add this import to create admin functionality
  getAdmins // Add this import for getting admins
} = require('../controllers/userController'); // Ensure all functions are imported
const { isAdmin } = require('../middlewares/roleMiddleware'); // Admin check
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create user - Accessible by admin only
router.post('/', authMiddleware, isAdmin, createUser); // Only Admins can create normal users

// Create admin - Accessible by admin only
//router.post('/admin', authMiddleware, isAdmin, createAdmin); // Only Admins can create other admins

// Update user details
router.put('/', authMiddleware, updateUser);

// Delete user
router.delete('/', authMiddleware, deleteUser);

// Get all users - Only accessible to admins
router.get('/', authMiddleware, isAdmin, getUsers); // Only Admins can access this route

// Get all admins - Only accessible to admins
//router.get('/admins', authMiddleware, isAdmin, getAdmins); // Only Admins can access this route

// Get user by ID
router.get('/:id', authMiddleware, getUserById);

module.exports = router;
