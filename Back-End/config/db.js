
const mongoose = require('mongoose');

const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

const connectDB = async () => {
  try {
    // MongoDB connection string from environment variables
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,  // 30 seconds timeout
      socketTimeoutMS: 45000,           // 45 seconds timeout
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);  // Exit process with failure code
  }
};

module.exports = connectDB;
