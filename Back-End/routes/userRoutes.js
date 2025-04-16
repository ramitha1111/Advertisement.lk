const express = require('express');
const upload = require('../middlewares/uploadMiddleware');
const { getUsersByRole } = require('../controllers/userController');
const { updateUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
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
router.put('/:id', authMiddleware, updateUser);

// Delete user
router.delete('/', authMiddleware, deleteUser);

// Get all users - Only accessible to admins
router.get('/', authMiddleware, isAdmin, getUsers); // Only Admins can access this route

// Get all admins - Only accessible to admins
//router.get('/admins', authMiddleware, isAdmin, getAdmins); // Only Admins can access this route

// Get user by ID
router.get('/:id', authMiddleware, getUserById);

// Upload profile image
router.put(
  '/update',
  authMiddleware,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  updateUser
);

// Get users by role
router.get('/role/:role', getUsersByRole);

module.exports = router;
