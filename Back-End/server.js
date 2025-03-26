const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
