const Auth = require('../models/user');
const mongoose = require('mongoose');

// Update User
exports.updateUser = async (req, res) => {
  const { name, username, phone } = req.body;
  const userId = req.user._id; // Assuming the user ID is stored in `req.user` after authentication

  try {
    // Find the user by ID
    let user = await Auth.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the username or email already exists (optional check to avoid duplicate data)
    const existingUsername = await Auth.findOne({ username });
    if (existingUsername && existingUsername._id.toString() !== userId) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Update user details
    user.name = name || user.name;
    user.username = username || user.username;
    user.phone = phone || user.phone;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: { name: user.name, username: user.username, phone: user.phone }
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
    const userId = req.user._id; // The user ID is attached to req.user after authentication
  
    try {
      // Find the user by ID
      const user = await Auth.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Delete the user
      await user.remove();
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      res.status(500).json({ message: 'Server error' });
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