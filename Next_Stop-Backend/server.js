const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Import services AFTER DB connection
const notificationScheduler = require("./src/services/notificationScheduler");

// Routes
const authRoutes = require('./src/routes/authRoutes');
const busRoutes = require('./src/routes/busRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const routeRoutes = require('./src/routes/routeRoutes');
const feedbackRoutes = require("./src/routes/feedbackRoutes");

console.log("✅ Auth routes mounted at /api/auth");

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/routes', routeRoutes);
app.use("/api/feedbacks", feedbackRoutes);

// Test endpoint for manual reminder
app.post("/api/test-reminder/:bookingId", async (req, res) => {
  try {
    console.log("Test reminder endpoint hit with bookingId:", req.params.bookingId);
    
    if (!notificationScheduler || !notificationScheduler.sendTestReminder) {
      return res.status(500).json({ message: "Notification scheduler not initialized" });
    }
    
    await notificationScheduler.sendTestReminder(req.params.bookingId);
    res.json({ message: "Test reminder triggered successfully" });
  } catch (error) {
    console.error("Test reminder error:", error);
    res.status(500).json({ 
      message: "Failed to send test reminder", 
      error: error.message 
    });
  }
});

// Clear sent reminders (for testing)
app.post("/api/clear-reminders", (req, res) => {
  notificationScheduler.clearSentReminders();
  res.json({ message: "Sent reminders cleared" });
});

// Start notification scheduler
notificationScheduler.start();

// Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});