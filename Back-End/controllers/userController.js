const Auth = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create User
exports.createUser = async (req, res) => {
  const { name, username, email, phone, password, role, googleId } = req.body;

  // Ensure that the request contains the necessary fields - done
  if (!name || !username || !email || !phone || !password) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  try {
    // Check if the username already exists
    const existingUsername = await Auth.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create the new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Auth({
      name,
      username,
      email,
      googleId,
      phone,
      password: hashedPassword, // Ensure to hash the password before saving (using bcrypt or similar) - used bcrypt
      role: role || 'user', // Default role to 'user', admin can be set optionally
    });

    // TODO: add all fields - done

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  const userId = req.user._id; // Assuming the user ID is stored in `req.user` after authentication
  const {
    name,
    username,
    email,
    phone,
    role,
    googleId,
    emailVerified,
    resetPasswordToken,
    resetPasswordExpires
  } = req.body;

  try {
    let user = await Auth.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for duplicate username or email
    if (username && username !== user.username) {
      const existing = await Auth.findOne({ username });
      if (existing && existing._id.toString() !== userId) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    if (email && email !== user.email) {
      const existingEmail = await Auth.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== userId) {
        return res.status(400).json({ message: 'Email already taken' });
      }
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.role = role || user.role;
    user.googleId = googleId || user.googleId;
    user.emailVerified = emailVerified !== undefined ? emailVerified : user.emailVerified;
    user.resetPasswordToken = resetPasswordToken || user.resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires || user.resetPasswordExpires;
    // TODO: add all fields - done

    // TODO: Configure this
    // Handle photo upload
    if (req.file) {
      user.photo = req.file.path; // Or save only filename if needed
    }
    //updated the hashed password
    const { password } = req.body;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified
      }
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

