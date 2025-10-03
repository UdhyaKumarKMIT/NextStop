import React, { useState } from "react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [language, setLanguage] = useState("English");
  const [username, setUsername] = useState("Malarvannan"); // example
  const [editName, setEditName] = useState(username);

  // Mock Data
  const currentBookings = [
    { id: 1, bus: "KPN Travels", date: "20 Sep 2025", seat: "A1" },
  ];
  const pastBookings = [
    { id: 2, bus: "Parveen Travels", date: "01 Sep 2025", seat: "B2" },
    { id: 3, bus: "RedBus Express", date: "10 Aug 2025", seat: "C3" },
  ];
  const coupons = [
    { id: 1, code: "SAVE100", discount: "₹100 Off" },
    { id: 2, code: "WELCOME50", discount: "₹50 Off" },
  ];

  return (
    <div className="min-h-screen bg-red-50">
      {/* Title Section */}
      <div className="bg-white shadow-md py-4 mb-6">
        <h1 className="text-2xl font-bold text-center text-red-600">
          Profile
        </h1>
      </div>

      <div className="max-w-6xl mx-auto p-8 flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-1/4 bg-white rounded-lg shadow-md p-6 space-y-4">
          <button
            onClick={() => setActiveTab("current")}
            className={`w-full text-left p-2 rounded ${
              activeTab === "current"
                ? "bg-red-600 text-white"
                : "hover:bg-red-100"
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`w-full text-left p-2 rounded ${
              activeTab === "past"
                ? "bg-red-600 text-white"
                : "hover:bg-red-100"
            }`}
          >
            Past Bookings
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left p-2 rounded ${
              activeTab === "settings"
                ? "bg-red-600 text-white"
                : "hover:bg-red-100"
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`w-full text-left p-2 rounded ${
              activeTab === "coupons"
                ? "bg-red-600 text-white"
                : "hover:bg-red-100"
            }`}
          >
            Coupons
          </button>
        </div>

        {/* Main Content */}
        <div className="w-3/4 bg-white rounded-lg shadow-md p-6">
          {activeTab === "current" && (
            <div>
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Current Bookings
              </h2>
              {currentBookings.map((b) => (
                <p key={b.id} className="border-b py-2">
                  {b.bus} – {b.date} – Seat {b.seat}
                </p>
              ))}
            </div>
          )}

          {activeTab === "past" && (
            <div>
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Past Bookings
              </h2>
              {pastBookings.map((b) => (
                <p key={b.id} className="border-b py-2">
                  {b.bus} – {b.date} – Seat {b.seat}
                </p>
              ))}
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Profile Settings
              </h2>

              {/* Change Username */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">
                  Change Username
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border p-2 rounded w-1/2"
                />
                <button
                  onClick={() => setUsername(editName)}
                  className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Save
                </button>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block font-semibold mb-2">
                  Select Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="English">English</option>
                  <option value="Tamil">தமிழ்</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "coupons" && (
            <div>
              <h2 className="text-xl font-bold text-red-600 mb-4">My Coupons</h2>
              {coupons.map((c) => (
                <p
                  key={c.id}
                  className="border-b py-2 flex justify-between items-center"
                >
                  <span>{c.code}</span>
                  <span className="text-green-600 font-semibold">
                    {c.discount}
                  </span>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
