const Auth = require('../models/user');

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
