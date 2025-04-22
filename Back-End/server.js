const express = require("express");
const cors = require("cors");
const passport = require("passport");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const packageRoutes = require("./routes/packageRoutes");
const advertisementRoutes = require("./routes/AdvertisementRoutes")
const favouritesRoutes = require("./routes/favouritesRoutes");
const contactRoutes = require("./routes/contactRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const compareRoute = require("./routes/compareRoute");
const notificationRoutes = require('./routes/notificationRoutes');
const http = require("http");
const socketIo = require("socket.io");

require("dotenv").config();
const session = require("express-session");
const {compare} = require("bcryptjs");
const {checkout} = require("./controllers/checkoutController");

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: '*', // Set your frontend origin
    methods: ['GET', 'POST']
  }
});
// Socket connections
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('New socket connected:', socket.id);

  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    for (let [userId, socketId] of connectedUsers) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
    console.log('Socket disconnected:', socket.id);
  });
});

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

// Middleware
app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

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
app.use("/api/contact", contactRoutes);
app.use("/api/compare", compareRoute);
//app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes)
app.use("/api/payment", paymentRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { app, server, io, connectedUsers };
