const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// MongoDB connection URI
const uri = 'your_mongodb_atlas_connection_string';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Secret key for JWT (Replace with a strong secret)
const JWT_SECRET = 'AdvertisementLk';

const loginUser = async (email, password) => {
  try {
    await client.connect();
    const db = client.db('yourDatabase');
    const usersCollection = db.collection('users');

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, user };
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }
};

module.exports = { loginUser };
