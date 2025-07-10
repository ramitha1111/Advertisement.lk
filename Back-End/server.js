const express = require("express");
const cors = require("cors");
const passport = require("passport");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const packageRoutes = require("./routes/packageRoutes");
const advertisementRoutes = require("./routes/advertisementRoutes")
const favouritesRoutes = require("./routes/favouritesRoutes");
const compareRoutes = require("./routes/compareRoute");
const contactRoutes = require("./routes/contactRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const siteSettingsRoutes = require("./routes/siteSettingsRoutes");
const path = require('path');

require("dotenv").config();
const session = require("express-session");
const {compare} = require("bcryptjs");
const {checkout} = require("./controllers/checkoutController");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
    origin: [
        process.env.CLIENT_URL,
        'http://128.199.132.175'
    ],
    credentials: true
}))

// Middleware
app.use(express.json());
app.use(session({secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

// Uploads
app.use('/assets/uploads', express.static('uploads'));

// Passport configuration
require("./config/passport")(passport);

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/advertisements", advertisementRoutes)
app.use("/api/favourites", favouritesRoutes)
app.use("/api/compare", compareRoutes)
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes)
app.use("/api/payment", paymentRoutes);
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/uploads", express.static('uploads'));

// Serve logo and favicon uploads specifically
app.use('/uploads/logos', express.static(path.join(__dirname, 'uploads/logos')));
app.use('/uploads/favicons', express.static(path.join(__dirname, 'uploads/favicons')));

// Serve profile and cover image uploads as static files
app.use('/assets/uploads/profile_photos', express.static(path.join(__dirname, 'uploads/profile_photos')));
app.use('/assets/uploads/cover_photos', express.static(path.join(__dirname, 'uploads/cover_photos')));
app.use('/assets/uploads/advertisementImages', express.static(path.join(__dirname, '/assets/uploads/advertisementImages')));
app.get('/', (req, res) => {
    res.send('API is working!');
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
