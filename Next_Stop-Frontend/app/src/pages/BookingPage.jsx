import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [type, setType] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [cities, setCities] = useState([]);
  const [busTypes, setBusTypes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCitiesAndTypes = async () => {
      try {
        const routesRes = await axios.get("http://localhost:5050/api/routes");
        const busesRes = await axios.get("http://localhost:5050/api/buses");

        const uniqueCities = Array.from(
          new Set([
            ...routesRes.data.routes.map((r) => r.source),
            ...routesRes.data.routes.map((r) => r.destination),
          ])
        );
        setCities(uniqueCities);

        const uniqueTypes = Array.from(new Set(busesRes.data.buses.map((b) => b.type)));
        setBusTypes(uniqueTypes);
      } catch (err) {
        console.error("Error fetching cities or bus types:", err);
      }
    };

    fetchCitiesAndTypes();
  }, []);

  const handleSearch = async () => {
    if (!fromCity || !toCity || !journeyDate) {
      setError("Please select source, destination, and journey date.");
      return;
    }

    setError("");
    try {
      const res = await axios.get("http://localhost:5050/api/buses/search", {
        params: {
          source: fromCity,
          destination: toCity,
          type,
          journeyDate,
        },
      });

      setBuses(res.data.buses);
      setFilteredBuses(res.data.buses);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching buses.");
      setBuses([]);
      setFilteredBuses([]);
    }
  };

  const handleNameSearch = (query) => {
    setFilteredBuses(
      buses.filter((bus) =>
        bus.busName.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleBookNow = (bus) => {
    // Navigate to seat booking page with bus details
    navigate("/seats", {
      state: {
        bus: bus,
        journeyDate: journeyDate
      }
    });
  };

  return (
    <div className="min-h-screen bg-red-50">
      <Navbar />

      <div className="pt-24 px-6">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-8">
          Book Your Bus
        </h1>

        {/* 🔍 Search Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto mb-10">
          <div className="grid md:grid-cols-4 gap-4">
            {/* From City */}
            <select
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="">From</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* To City */}
            <select
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="">To</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Bus Type */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="">Any Type</option>
              {busTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* 🗓️ Journey Date */}
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
              min={new Date().toISOString().split("T")[0]}
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="col-span-4 mt-4 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition"
            >
              Search Buses
            </button>
          </div>

          {/* 🔎 Search by Bus Name */}
          <input
            type="text"
            placeholder="Search by bus name..."
            onChange={(e) => handleNameSearch(e.target.value)}
            className="w-full mt-4 p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
          />

          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>

        {/* 🚌 Bus Results */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredBuses.length === 0 ? (
            <p className="text-center text-gray-600">
              No buses found. Please search to see results.
            </p>
          ) : (
            filteredBuses.map((bus) => (
              <div
                key={bus.busNumber}
                className="bg-white shadow-md p-6 rounded-lg flex justify-between items-center hover:shadow-lg transition"
              >
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-red-600">
                    {bus.busName}
                  </h2>
                  <p className="text-gray-700">{bus.type}</p>
                  <p className="text-gray-500">
                    Route: {bus.route.source} → {bus.route.destination}
                  </p>
                  <p className="text-gray-500">
                    Distance: {bus.route.distance} km | Duration:{" "}
                    {bus.route.duration}
                  </p>
                  <p className="text-gray-500">
                    Seats Available: {bus.seatInfo?.availableSeats ?? "N/A"}
                  </p>
                  <p className="text-gray-500">
                    Operators: {bus.operatorName1} ({bus.operatorPhone1}) 
                    {bus.operatorName2 && `, ${bus.operatorName2} (${bus.operatorPhone2})`}
                  </p>
                </div>

                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-gray-800">
                    ₹{bus.seatInfo?.price ?? "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    per seat
                  </p>
                  <button 
                    onClick={() => handleBookNow(bus)}
                    className="mt-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Book Now
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