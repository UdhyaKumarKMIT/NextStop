import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
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
    address: ""
  });

  const [editProfile, setEditProfile] = useState({ ...profile });
  const [currentBookings, setCurrentBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

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
        
        // In a real app, you'd fetch these from separate endpoints
        setCurrentBookings(user.currentBookings || []);
        setPastBookings(user.pastBookings || []);

      } catch (err) {
        console.error("Failed to fetch user:", err);
        setMessage({ type: 'error', text: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
      
      // Clear message after 3 seconds
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

  // Reset edit form to original values
  const handleCancelEdit = () => {
    setEditProfile(profile);
    setMessage({ type: '', text: '' });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
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
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left p-2 rounded ${
              activeTab === "profile" ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("current")}
            className={`w-full text-left p-2 rounded ${
              activeTab === "current" ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`w-full text-left p-2 rounded ${
              activeTab === "past" ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`}
          >
            Past Bookings
          </button>
          
        </div>

        {/* Main Content */}
        <div className="w-3/4 bg-white rounded-lg shadow-md p-6">
          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <div>
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
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
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
              {currentBookings.length > 0 ? (
                <div className="space-y-4">
                  {currentBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.bus}</h3>
                          <p className="text-gray-600">Date: {booking.date}</p>
                          <p className="text-gray-600">Seat: {booking.seat}</p>
                          <p className="text-gray-600">From: {booking.from} → To: {booking.to}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            Confirmed
                          </span>
                          <p className="text-lg font-bold text-red-600 mt-2">${booking.price}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          View Ticket
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg mb-4">No current bookings found</div>
                  <button 
                  onClick={() => window.location.href = '/booking'}
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
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
              {pastBookings.length > 0 ? (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.bus}</h3>
                          <p className="text-gray-600">Date: {booking.date}</p>
                          <p className="text-gray-600">Seat: {booking.seat}</p>
                          <p className="text-gray-600">From: {booking.from} → To: {booking.to}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                            Completed
                          </span>
                          <p className="text-lg font-bold text-gray-600 mt-2">${booking.price}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
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