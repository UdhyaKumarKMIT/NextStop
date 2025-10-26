// src/controllers/leaderboardController.js
const User = require("../models/User");

// Get all-time leaderboard
const getLeaderboard = async (req, res) => {
  try {
    console.log("📊 Fetching leaderboard...");
    console.log("Authenticated user:", req.user ? req.user.username : "No user");
    
    const users = await User.find({})
      .select('username score totalBookings totalSpent createdAt')
      .sort({ score: -1, totalBookings: -1 })
      .limit(50);

    console.log(`✅ Found ${users.length} users for leaderboard`);

    res.json({
      success: true,
      leaderboard: users,
      lastUpdated: new Date(),
      type: "allTime"
    });
  } catch (error) {
    console.error("❌ Leaderboard Error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get current month leaderboard
const getCurrentMonthLeaderboard = async (req, res) => {
  try {
    console.log("📊 Fetching current month leaderboard...");
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const users = await User.find({})
      .select('username score totalBookings totalSpent createdAt')
      .sort({ score: -1, totalBookings: -1 })
      .limit(50);

    res.json({
      success: true,
      leaderboard: users,
      month: startOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
      lastUpdated: new Date(),
      type: "currentMonth"
    });
  } catch (error) {
    console.error("❌ Current Month Leaderboard Error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get user's current rank
const getUserRank = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    console.log("📊 Fetching user rank for:", req.user.username);
    
    const username = req.user.username;
    
    const allUsers = await User.find({})
      .select('username score')
      .sort({ score: -1 });

    const userIndex = allUsers.findIndex(user => user.username === username);
    const userRank = userIndex !== -1 ? userIndex + 1 : null;

    const user = await User.findOne({ username }).select('username score totalBookings totalSpent');

    console.log(`✅ User ${username} rank: ${userRank}`);

    res.json({
      success: true,
      rank: userRank,
      totalUsers: allUsers.length,
      user: user
    });
  } catch (error) {
    console.error("❌ Get User Rank Error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = {
  getLeaderboard,
  getCurrentMonthLeaderboard,
  getUserRank
};