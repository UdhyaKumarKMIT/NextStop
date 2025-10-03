import React, { useState } from "react";
import Navbar from "../components/Navbar";

const BookingPage = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBuses, setFilteredBuses] = useState([]);

  // Mock data (later fetch from backend)
  const cities = ["Chennai", "Bangalore", "Hyderabad", "Coimbatore", "Madurai"];

  const buses = [
    {
      id: 1,
      name: "KPN Travels",
      type: "Sleeper AC",
      departure: "09:00 PM",
      arrival: "06:00 AM",
      price: 850,
    },
    {
      id: 2,
      name: "Parveen Travels",
      type: "Semi Sleeper",
      departure: "10:30 PM",
      arrival: "05:30 AM",
      price: 650,
    },
    {
      id: 3,
      name: "RedBus Express",
      type: "Luxury AC",
      departure: "08:00 PM",
      arrival: "05:00 AM",
      price: 950,
    },
  ];

  // Simulate bus search
  const handleSearch = () => {
    const result = buses.filter((bus) =>
      bus.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBuses(result.length ? result : buses); // default show all if no match
  };

  return (
    <div className="min-h-screen bg-red-50">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="pt-24 px-6"> {/* 👈 adds space below navbar */}
        <h1 className="text-3xl font-bold text-center text-red-600 mb-8">
          Book Your Bus
        </h1>

        {/* Search Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto mb-10">
          <div className="grid md:grid-cols-3 gap-4">
            {/* From City */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                From
              </label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select City</option>
                {cities.map((city, idx) => (
                  <option key={idx} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* To City */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                To
              </label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select City</option>
                {cities.map((city, idx) => (
                  <option key={idx} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition"
              >
                Search Buses
              </button>
            </div>
          </div>

          {/* Bus Name Search */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search by bus name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Bus Results */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredBuses.length === 0 ? (
            <p className="text-center text-gray-600">
              No buses found. Please search to see results.
            </p>
          ) : (
            filteredBuses.map((bus) => (
              <div
                key={bus.id}
                className="bg-white shadow-md p-6 rounded-lg flex justify-between items-center hover:shadow-lg transition"
              >
                <div>
                  <h2 className="text-xl font-semibold text-red-600">
                    {bus.name}
                  </h2>
                  <p className="text-gray-700">{bus.type}</p>
                  <p className="text-gray-500">
                    Departure: {bus.departure} | Arrival: {bus.arrival}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">₹{bus.price}</p>
                  <button className="mt-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition">
                    Book
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
