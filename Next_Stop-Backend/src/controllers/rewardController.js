// src/controllers/rewardController.js
const User = require("../models/User");

// Distribute monthly rewards to top 3 users
const distributeMonthlyRewards = async (req, res) => {
  try {
    console.log("🎁 Distributing monthly rewards...");
    
    const startOfMonth = new Date();
    startOfMonth.setMonth(startOfMonth.getMonth() - 1);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Get top 3 users based on score
    const topUsers = await User.find({})
      .select('username score totalBookings totalSpent')
      .sort({ score: -1 })
      .limit(3);

    console.log(`🏆 Top 3 users:`, topUsers.map(u => u.username));

    const rewards = [
      { rank: 1, discount: 20, description: "🏆 First Place - 20% discount on next booking" },
      { rank: 2, discount: 15, description: "🥈 Second Place - 15% discount on next booking" },
      { rank: 3, discount: 10, description: "🥉 Third Place - 10% discount on next booking" }
    ];

    const rewardExpiry = new Date();
    rewardExpiry.setMonth(rewardExpiry.getMonth() + 1); // Valid for 1 month

    const rewardedUsers = [];

    // Distribute rewards to top 3 users
    for (let i = 0; i < topUsers.length; i++) {
      const user = topUsers[i];
      const reward = rewards[i];
      
      const updatedUser = await User.findOneAndUpdate(
        { username: user.username },
        {
          $push: {
            rewards: {
              type: 'discount',
              value: reward.discount,
              description: reward.description,
              expiresAt: rewardExpiry,
              used: false
            }
          },
          lastRewardDate: new Date()
        },
        { new: true }
      );

      rewardedUsers.push({
        username: user.username,
        rank: i + 1,
        score: user.score,
        reward: reward.description
      });
    }

    console.log("✅ Monthly rewards distributed successfully");

    res.json({
      success: true,
      message: "Monthly rewards distributed successfully",
      rewardedUsers: rewardedUsers,
      distributionDate: new Date()
    });
  } catch (error) {
    console.error("❌ Reward Distribution Error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get user's available rewards
const getUserRewards = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    console.log("🎁 Fetching rewards for:", req.user.username);
    
    const username = req.user.username;
    
    const user = await User.findOne({ username })
      .select('username rewards lastRewardDate');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const activeRewards = user.rewards.filter(reward => 
      !reward.used && new Date(reward.expiresAt) > new Date()
    );

    console.log(`✅ Found ${activeRewards.length} active rewards for ${username}`);

    res.json({
      success: true,
      rewards: activeRewards,
      totalRewards: user.rewards.length,
      activeRewards: activeRewards.length
    });
  } catch (error) {
    console.error("❌ Get User Rewards Error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = {
  distributeMonthlyRewards,
  getUserRewards
};