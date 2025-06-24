const Auth = require('../models/user');
const mongoose = require('mongoose');

const path = require('path');
const bcrypt = require('bcryptjs');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const upload = require('../middlewares/upload');

// Multer middleware for image uploads
const handleFileUploads = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

// Normalize and convert paths for frontend
const normalizePath = (filePath) => `${BASE_URL}/${filePath.replace(/\\/g, '/')}`;

exports.createUser = [
  handleFileUploads, // Assuming this handles 'profileImage' and 'coverImage' fields
  async (req, res) => {
    try {
      const { firstName, lastName, username, email, phone, password, role } = req.body;

      if (!firstName || !lastName || !username || !email || !password) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }

      const existingUsername = await Auth.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const profileImage = req.files?.profileImage
          ? normalizePath(req.files.profileImage[0].path)
          : null;

      const coverImage = req.files?.coverImage
          ? normalizePath(req.files.coverImage[0].path)
          : null;

      const newUser = new Auth({
        firstName,
        lastName,
        username,
        email,
        phone,
        password: hashedPassword,
        role: role || 'user',
        profileImage,
        emailVerified: true,
        coverImage,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await newUser.save();

      res.status(200).json({
        message: 'User created successfully',
        user: {
          id: newUser._id,
          fistName: newUser.fistName,
          lastName: newUser.lastName,
          username: newUser.username,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          profileImage: newUser.profileImage,
          coverImage: newUser.coverImage
        }
      });
    } catch (error) {
      console.error('Error in createUser:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];


exports.updateUser = [
  handleFileUploads, // Should handle 'profileImage' and 'coverImage'
  async (req, res) => {
    try {
      const userId = req.params.id;
      const { firstName, lastName, username, password, email, phone, role } = req.body;

      const user = await Auth.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update fields if they are present
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (username) user.username = username;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (role) user.role = role;

      // Only hash and update password if provided
      if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }

      // Handle new profile and cover images
      if (req.files?.profileImage) {
        user.profileImage = normalizePath(req.files.profileImage[0].path);
      }

      if (req.files?.coverImage) {
        user.coverImage = normalizePath(req.files.coverImage[0].path);
      }

      user.updatedAt = new Date();
      await user.save();

      res.status(200).json({
        message: 'User updated successfully',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profileImage: user.profileImage,
          coverImage: user.coverImage
        }
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];


// Delete User
exports.deleteUser = async (req, res) => {
  const userId = req.params.id; // Ensure optional chaining in case req.user is undefined

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  try {
    const deletedUser = await Auth.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get All Users
exports.getUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await Auth.find().select('-password -otp'); // Exclude sensitive fields like password and OTP

    // Check if no users found
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Send the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find the user by their ID
    const user = await Auth.findById(id).select('-password -otp'); // Exclude sensitive fields like password and OTP

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Users by Role
exports.getUsersByRole = async (req, res) => {
  const { role } = req.params;

  // Validate role
  const allowedRoles = ['user', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const users = await Auth.find({ role }).select('-password -otp -resetPasswordToken -resetPasswordExpires');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: `No users found with role: ${role}` });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getUsersByRole:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

