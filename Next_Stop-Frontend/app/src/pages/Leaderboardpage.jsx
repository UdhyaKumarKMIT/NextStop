// components/LeaderboardPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_BASE_URL = "http://4.188.80.153:5050/api";

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("allTime"); // "allTime" or "currentMonth"
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
    fetchUserRank();
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = activeTab === "allTime" 
        ? "/leaderboard" 
        : "/leaderboard/current-month";
      
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRank = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/auth/getUserProfile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const user = response.data.user;
      
      // Calculate user's rank
      const allTimeResponse = await axios.get(`${API_BASE_URL}/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userIndex = allTimeResponse.data.leaderboard.findIndex(
        u => u.username === user.username
      );
      
      setUserRank(userIndex + 1);
    } catch (error) {
      console.error("Error fetching user rank:", error);
    }
  };

  const getRankBadge = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const getRankColor = (index) => {
    if (index === 0) return "bg-yellow-100 border-yellow-300";
    if (index === 1) return "bg-gray-100 border-gray-300";
    if (index === 2) return "bg-orange-100 border-orange-300";
    return "bg-white border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-red-50">
        <Navbar />
        <div className="pt-24 flex justify-center">
          <div className="text-center">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50">
      <Navbar />
      
      <div className="pt-24 px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              🏆 Leaderboard
            </h1>
            <p className="text-gray-600 mb-4">
              Top travelers get amazing rewards every month!
            </p>
            
            {/* User Rank Display */}
            {userRank && (
              <div className="bg-red-50 p-4 rounded-lg inline-block">
                <p className="text-red-600 font-semibold">
                  Your Rank: <span className="text-2xl">#{userRank}</span>
                </p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("allTime")}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === "allTime"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All Time Ranking
              </button>
              <button
                onClick={() => setActiveTab("currentMonth")}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === "currentMonth"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Current Month
              </button>
            </div>
          </div>

          {/* Rewards Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-yellow-800 mb-3">
              🎁 Monthly Rewards
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-yellow-100 rounded-lg">
                <div className="text-2xl mb-2">🥇</div>
                <h4 className="font-bold text-yellow-800">1st Place</h4>
                <p className="text-yellow-600">20% Discount</p>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <div className="text-2xl mb-2">🥈</div>
                <h4 className="font-bold text-gray-800">2nd Place</h4>
                <p className="text-gray-600">15% Discount</p>
              </div>
              <div className="text-center p-4 bg-orange-100 rounded-lg">
                <div className="text-2xl mb-2">🥉</div>
                <h4 className="font-bold text-orange-800">3rd Place</h4>
                <p className="text-orange-600">10% Discount</p>
              </div>
            </div>
            <p className="text-yellow-700 text-sm mt-4 text-center">
              * Rewards are distributed at the end of each month
            </p>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Rank</th>
                    <th className="px-6 py-4 text-left">User</th>
                    <th className="px-6 py-4 text-center">Score</th>
                    <th className="px-6 py-4 text-center">Bookings</th>
                    <th className="px-6 py-4 text-center">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, index) => (
                    <tr 
                      key={user._id} 
                      className={`border-b ${getRankColor(index)} hover:bg-gray-50 transition`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-xl font-bold mr-3">
                            {getRankBadge(index)}
                          </span>
                          {index > 2 && (
                            <span className="text-gray-500 font-semibold">
                              #{index + 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">
                          {user.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">
                          {activeTab === "allTime" ? user.score : user.monthlyScore || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {user.totalBookings || 0}
                      </td>
                      <td className="px-6 py-4 text-center text-green-600 font-semibold">
                        ₹{user.totalSpent || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {leaderboard.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No data available for the leaderboard.
              </div>
            )}
          </div>

          {/* How to Earn Points */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              📈 How to Earn Points
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                  ✅
                </div>
                <div>
                  <p className="font-semibold">Complete a Booking</p>
                  <p className="text-sm text-gray-600">+10 points per booking</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  💰
                </div>
                <div>
                  <p className="font-semibold">Spend More</p>
                  <p className="text-sm text-gray-600">Higher spending = Better ranking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;