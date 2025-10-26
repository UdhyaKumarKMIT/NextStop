// src/routes/leaderboard.js - FIXED VERSION
const express = require('express');
const router = express.Router();

// ✅ CORRECTED: Use your existing auth middleware
const { authBooking } = require('../models/middleware/authMiddleware');

// Import leaderboard controllers
const leaderboardController = require('../controllers/leaderboardController');
const rewardController = require('../controllers/rewardController');

console.log("✅ Leaderboard routes initialized");

// Leaderboard routes - using authBooking middleware
router.get('/', authBooking, leaderboardController.getLeaderboard);
router.get('/current-month', authBooking, leaderboardController.getCurrentMonthLeaderboard);
router.get('/my-rank', authBooking, leaderboardController.getUserRank);

// Reward routes
router.post('/distribute-rewards', authBooking, rewardController.distributeMonthlyRewards);
router.get('/my-rewards', authBooking, rewardController.getUserRewards);

// ✅ FIXED: Remove the problematic wildcard route
// Instead, let Express handle 404s at the app level

module.exports = router;