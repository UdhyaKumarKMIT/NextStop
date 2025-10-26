import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5050/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // User profile state
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    mobileNo: "",
    altMobileNo: "",
    dob: "",
    address: "",
    score: 0,
    totalBookings: 0,
    totalSpent: 0
  });

  const [editProfile, setEditProfile] = useState({ ...profile });
  const [currentBookings, setCurrentBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [routeInfo, setRouteInfo] = useState({});
  
  // Leaderboard state
  const [userRank, setUserRank] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [leaderboardStats, setLeaderboardStats] = useState({
    totalUsers: 0,
    topScore: 0
  });

  // ✅ Fetch user info after login
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage({ type: 'error', text: 'Please login to view profile' });
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/auth/getUserProfile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.user;
        setProfile(user);
        setEditProfile(user);

        // Fetch additional leaderboard data
        await fetchUserRank(token);
        await fetchUserRewards(token);
        await fetchLeaderboardStats(token);

      } catch (err) {
        console.error("Failed to fetch user:", err);
        setMessage({ type: 'error', text: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Fetch user rank
  const fetchUserRank = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leaderboard/my-rank`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserRank(response.data.rank);
    } catch (error) {
      console.error("Error fetching user rank:", error);
      // If leaderboard API fails, calculate rank from all users
      try {
        const allUsersResponse = await axios.get(`${API_BASE_URL}/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allUsers = allUsersResponse.data.leaderboard || [];
        const currentUserIndex = allUsers.findIndex(user => user.username === profile.username);
        if (currentUserIndex !== -1) {
          setUserRank(currentUserIndex + 1);
        }
      } catch (fallbackError) {
        console.error("Fallback rank fetch failed:", fallbackError);
      }
    }
  };

  // ✅ Fetch user rewards
  const fetchUserRewards = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leaderboard/my-rewards`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRewards(response.data.rewards || []);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      // Fallback to profile rewards if separate API fails
      try {
        const profileResponse = await axios.get(`${API_BASE_URL}/auth/getUserProfile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRewards(profileResponse.data.user.rewards || []);
      } catch (fallbackError) {
        console.error("Fallback rewards fetch failed:", fallbackError);
      }
    }
  };

  // ✅ Fetch leaderboard stats
  const fetchLeaderboardStats = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const leaderboard = response.data.leaderboard || [];
      if (leaderboard.length > 0) {
        setLeaderboardStats({
          totalUsers: leaderboard.length,
          topScore: leaderboard[0]?.score || 0
        });
      }
    } catch (error) {
      console.error("Error fetching leaderboard stats:", error);
    }
  };

  // ✅ Fetch bookings when bookings tab is active
  useEffect(() => {
    const fetchBookings = async () => {
      if (activeTab === "current" || activeTab === "past") {
        try {
          setBookingsLoading(true);
          const token = localStorage.getItem("token");
          if (!token) return;

          const response = await axios.get(`${API_BASE_URL}/bookings/my-bookings`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const allBookings = response.data.bookings || [];

          // Fetch route information for each booking
          const routePromises = allBookings.map(async (booking) => {
            try {
              const routeResponse = await axios.get(`${API_BASE_URL}/routes/${booking.routeId}`);
              return { 
                routeId: booking.routeId, 
                destination: routeResponse.data.route?.destination || 'Unknown',
                source: routeResponse.data.route?.source || 'Unknown'
              };
            } catch (error) {
              console.error(`Failed to fetch route for ${booking.routeId}:`, error.response?.data || error.message);
              return { 
                routeId: booking.routeId, 
                destination: 'Unknown Destination',
                source: 'Unknown'
              };
            }
          });

          const routesData = await Promise.all(routePromises);
          const routeMap = {};
          routesData.forEach(route => {
            routeMap[route.routeId] = {
              destination: route.destination,
              source: route.source
            };
          });
          setRouteInfo(routeMap);

          // Separate current and past bookings
          const now = new Date();
          const current = [];
          const past = [];

          allBookings.forEach(booking => {
            const journeyDate = new Date(booking.journeyDate);
            if (journeyDate >= now && booking.bookingStatus === "Confirmed") {
              current.push(booking);
            } else {
              past.push(booking);
            }
          });

          setCurrentBookings(current);
          setPastBookings(past);

        } catch (err) {
          console.error("Failed to fetch bookings:", err);
          setMessage({ type: 'error', text: 'Failed to load bookings' });
        } finally {
          setBookingsLoading(false);
        }
      }
    };

    fetchBookings();
  }, [activeTab]);

  // Handle input changes for profile editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Update user profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(`${API_BASE_URL}/auth/updateUserProfile`, editProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(editProfile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  // ✅ Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/bookings/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: 'success', text: 'Booking cancelled successfully!' });
      
      // Refresh bookings
      const response = await axios.get(`${API_BASE_URL}/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allBookings = response.data.bookings || [];
      const now = new Date();
      const current = [];
      const past = [];

      allBookings.forEach(booking => {
        const journeyDate = new Date(booking.journeyDate);
        if (journeyDate >= now && booking.bookingStatus === "Confirmed") {
          current.push(booking);
        } else {
          past.push(booking);
        }
      });

      setCurrentBookings(current);
      setPastBookings(past);

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to cancel booking' 
      });
    }
  };

  // ✅ Know Your Destination function
  const handleKnowDestination = (destination) => {
    const formattedDestination = destination
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    const destinationURL = `https://en.wikipedia.org/wiki/${formattedDestination.replace(/-/g, '_')}`;
    const newWindow = window.open(destinationURL, '_blank');
    
    setTimeout(() => {
      if (newWindow.closed || !newWindow.location.href) {
        const wikiURL = `https://en.wikipedia.org/wiki/${formattedDestination.replace(/-/g, '_')}`;
        window.open(wikiURL, '_blank');
      }
    }, 1000);
  };

  // ✅ Navigate to Leaderboard
  const handleGoToLeaderboard = () => {
    navigate("/leaderboard");
  };

  // ✅ Logout function
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Reset edit form to original values
  const handleCancelEdit = () => {
    setEditProfile(profile);
    setMessage({ type: '', text: '' });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get destination name from route info
  const getDestination = (routeId) => {
    return routeInfo[routeId]?.destination || 'Destination';
  };

  // Get rank badge color
  const getRankBadge = (rank) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (rank === 2) return "bg-gray-100 text-gray-800 border-gray-300";
    if (rank === 3) return "bg-orange-100 text-orange-800 border-orange-300";
    return "bg-blue-100 text-blue-800 border-blue-300";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50">
      {/* Title Section */}
      <div className="bg-white shadow-md py-4 mb-6">
        <h1 className="text-2xl font-bold text-center text-red-600">
          Profile
        </h1>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`max-w-6xl mx-auto mb-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="max-w-6xl mx-auto p-8 flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-1/4 bg-white rounded-lg shadow-md p-6 space-y-4">
          <button
            onClick={() => navigate("/booking")}
            className="w-full text-left p-2 rounded transition-colors hover:bg-red-100 text-gray-700"
          >
            Go to Booking
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left p-2 rounded transition-colors ${
              activeTab === "profile" ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("current")}
            className={`w-full text-left p-2 rounded transition-colors ${
              activeTab === "current" ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`w-full text-left p-2 rounded transition-colors ${
              activeTab === "past" ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`}
          >
            Past Bookings
          </button>
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-2"></div>

          {/* Leaderboard Button */}
          <button
            onClick={handleGoToLeaderboard}
            className="w-full text-left p-2 rounded transition-colors bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center gap-2"
          >
            <span>🏆</span>
            View Leaderboard
          </button>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full text-left p-2 rounded transition-colors bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white flex items-center gap-2"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="w-3/4 bg-white rounded-lg shadow-md p-6">
          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <div>
              {/* Leaderboard Stats Section */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Your Travel Stats</h2>
                    <p className="text-red-100">Track your progress and earn rewards!</p>
                  </div>
                  <div className="text-right">
                    {userRank && (
                      <div className={`px-4 py-2 rounded-full border-2 ${getRankBadge(userRank)}`}>
                        <span className="text-sm">Rank</span>
                        <div className="text-2xl font-bold">#{userRank}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{profile.score || 0}</div>
                    <div className="text-red-100 text-sm">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{profile.totalBookings || 0}</div>
                    <div className="text-red-100 text-sm">Bookings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">₹{profile.totalSpent || 0}</div>
                    <div className="text-red-100 text-sm">Total Spent</div>
                  </div>
                </div>
              </div>

              {/* Rewards Section */}
              {rewards.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                    🎁 Your Rewards
                  </h2>
                  <div className="space-y-3">
                    {rewards.map((reward, index) => (
                      <div key={index} className="bg-white border border-yellow-300 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-yellow-800">{reward.description}</p>
                            <p className="text-sm text-yellow-600">
                              Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            reward.used 
                              ? "bg-gray-200 text-gray-600" 
                              : "bg-green-200 text-green-700"
                          }`}>
                            {reward.used ? "Used" : "Active"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How to Earn Points */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-blue-800 mb-3">📈 How to Earn Points</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                      ✅
                    </div>
                    <div>
                      <p className="font-semibold">Complete a Booking</p>
                      <p className="text-sm text-blue-600">+10 points per booking</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                      🏆
                    </div>
                    <div>
                      <p className="font-semibold">Top Monthly Rank</p>
                      <p className="text-sm text-blue-600">Get discount rewards</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-red-600 mb-6">Profile Information</h2>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">
                    Personal Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={editProfile.username}
                      onChange={handleInputChange}
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={editProfile.firstName}
                      onChange={handleInputChange}
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={editProfile.lastName}
                      onChange={handleInputChange}
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={editProfile.dob ? editProfile.dob.split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">
                    Contact Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editProfile.email}
                      onChange={handleInputChange}
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNo"
                      value={editProfile.mobileNo}
                      onChange={handleInputChange}
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alternate Mobile
                    </label>
                    <input
                      type="tel"
                      name="altMobileNo"
                      value={editProfile.altMobileNo}
                      onChange={handleInputChange}
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={editProfile.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Current Bookings Tab */}
          {activeTab === "current" && (
            <div>
              <h2 className="text-xl font-bold text-red-600 mb-6">Current Bookings</h2>
              {bookingsLoading ? (
                <div className="text-center py-8">
                  <div className="text-red-600 text-xl">Loading bookings...</div>
                </div>
              ) : currentBookings.length > 0 ? (
                <div className="space-y-4">
                  {currentBookings.map((booking) => {
                    const destination = getDestination(booking.routeId);
                    return (
                      <div key={booking._id} className="border border-green-200 rounded-lg p-6 bg-green-50 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-800">{booking.busNumber}</h3>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <p className="text-gray-600">
                                  <span className="font-medium">Date:</span> {formatDate(booking.journeyDate)}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Time:</span> {formatTime(booking.journeyDate)}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Seats:</span> {booking.seatNumbers.join(', ')}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">
                                  <span className="font-medium">Boarding:</span> {booking.boardingPoint}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Destination:</span> {destination}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Passengers:</span> {booking.totalSeats}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              {booking.bookingStatus}
                            </span>
                            <p className="text-xl font-bold text-red-600 mt-2">₹{booking.totalFare}</p>
                          </div>
                        </div>
                        
                        {/* Passenger Details */}
                        <div className="mt-4 border-t pt-4">
                          <h4 className="font-medium text-gray-700 mb-2">Passenger Details:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {booking.passengerDetails.map((passenger, index) => (
                              <div key={index} className="text-sm text-gray-600">
                                {passenger.name} ({passenger.age} yrs, {passenger.gender}) - Seat {passenger.seatNumber}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                          <button 
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-600 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            Cancel Booking
                          </button>
                          <button 
                            onClick={() => handleKnowDestination(destination)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition-colors flex items-center gap-1"
                          >
                            <svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                              />
                            </svg>
                            Know Your Destination
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg mb-4">No current bookings found</div>
                  <button 
                    onClick={() => navigate("/booking")}
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Book a Bus
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Past Bookings Tab */}
          {activeTab === "past" && (
            <div>
              <h2 className="text-xl font-bold text-red-600 mb-6">Past Bookings</h2>
              {bookingsLoading ? (
                <div className="text-center py-8">
                  <div className="text-red-600 text-xl">Loading bookings...</div>
                </div>
              ) : pastBookings.length > 0 ? (
                <div className="space-y-4">
                  {pastBookings.map((booking) => {
                    const destination = getDestination(booking.routeId);
                    return (
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-800">{booking.busNumber}</h3>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <p className="text-gray-600">
                                  <span className="font-medium">Date:</span> {formatDate(booking.journeyDate)}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Time:</span> {formatTime(booking.journeyDate)}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Seats:</span> {booking.seatNumbers.join(', ')}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">
                                  <span className="font-medium">Boarding:</span> {booking.boardingPoint}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Destination:</span> {destination}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Status:</span> {booking.bookingStatus}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.bookingStatus === 'Cancelled' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.bookingStatus}
                            </span>
                            <p className="text-xl font-bold text-gray-600 mt-2">₹{booking.totalFare}</p>
                          </div>
                        </div>
                        
                        {/* Passenger Details */}
                        <div className="mt-4 border-t pt-4">
                          <h4 className="font-medium text-gray-700 mb-2">Passenger Details:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {booking.passengerDetails.map((passenger, index) => (
                              <div key={index} className="text-sm text-gray-600">
                                {passenger.name} ({passenger.age} yrs, {passenger.gender}) - Seat {passenger.seatNumber}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                          <button 
                            onClick={() => handleKnowDestination(destination)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition-colors flex items-center gap-1"
                          >
                            <svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                              />
                            </svg>
                            Know Your Destination
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-600 px-3 py-1 rounded hover:bg-red-50 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg">No past bookings found</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;