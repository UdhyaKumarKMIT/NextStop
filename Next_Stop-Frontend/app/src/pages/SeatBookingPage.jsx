import React, { useState, useEffect } from "react";
import { FaChair } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const SeatBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bus, journeyDate } = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Seat layout configuration
  const rows = 10;
  
  useEffect(() => {
    if (!bus) {
      navigate("/booking");
      return;
    }

    // Extract booked seats from bus.seatInfo
    if (bus.seatInfo && bus.seatInfo.seats) {
      const booked = bus.seatInfo.seats
        .filter(seat => !seat.isAvailable)
        .map(seat => `${seat.row}-${seat.column}`);
      setBookedSeats(booked);
    }
    
    setLoading(false);
  }, [bus, navigate]);

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      // Check if seat limit reached (you can set a max limit)
      if (selectedSeats.length >= 6) {
        alert("You can select maximum 6 seats at a time");
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  
  const finalizeBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    // Calculate total price
    const seatPrice = bus.seatInfo?.price || 0;
    const totalPrice = seatPrice * selectedSeats.length;

    // Navigate to payment page with all necessary data
    navigate("/payment", {
      state: {
        bus: bus,
        journeyDate: journeyDate,
        selectedSeats: selectedSeats,
        totalPrice: totalPrice,
        seatPrice: seatPrice
      }
    });
  };

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return "booked";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-xl text-red-600">No bus selected</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50">
      <Navbar />
      
      <div className="pt-24 px-6">
        {/* Bus Information Header */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4 text-center">
            Select Your Seats
          </h1>
          
          <div className="grid md:grid-cols-2 gap-6 text-center md:text-left">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{bus.busName}</h2>
              <p className="text-gray-600">{bus.type}</p>
              <p className="text-gray-600">
                {bus.route.source} → {bus.route.destination}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <strong>Date:</strong> {new Date(journeyDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <strong>Price:</strong> ₹{bus.seatInfo?.price || "N/A"} per seat
              </p>
              <p className="text-gray-600">
                <strong>Available Seats:</strong> {bus.seatInfo?.availableSeats || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Bus Layout */}
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-8">
          {/* Legend */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-600 rounded"></div>
              <span>Booked</span>
            </div>
          </div>

          {/* Driver's Cabin */}
          <div className="text-center mb-8">
            <div className="bg-gray-200 w-32 h-12 mx-auto rounded-t-lg flex items-center justify-center">
              <span className="text-sm font-semibold">Driver Cabin</span>
            </div>
          </div>

          {/* Seats Grid */}
          <div className="flex flex-col gap-4">
            {[...Array(rows)].map((_, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-8">
                {/* Left side (2 seats) */}
                <div className="flex gap-4">
                  {[...Array(2)].map((_, colIndex) => {
                    const seatId = `${rowIndex + 1}-${colIndex + 1}`;
                    const status = getSeatStatus(seatId);

                    return (
                      <div
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg cursor-pointer transition-all duration-200 ${
                          status === "booked"
                            ? "bg-red-600 cursor-not-allowed"
                            : status === "selected"
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 hover:bg-gray-400 hover:scale-105"
                        }`}
                      >
                        <FaChair className="text-lg" />
                        <span className="text-xs mt-1">{rowIndex + 1}-{colIndex + 1}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Aisle */}
                <div className="w-12 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Aisle</span>
                </div>

                {/* Right side (2 seats) */}
                <div className="flex gap-4">
                  {[...Array(2)].map((_, colIndex) => {
                    const seatId = `${rowIndex + 1}-${colIndex + 3}`;
                    const status = getSeatStatus(seatId);

                    return (
                      <div
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg cursor-pointer transition-all duration-200 ${
                          status === "booked"
                            ? "bg-red-600 cursor-not-allowed"
                            : status === "selected"
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 hover:bg-gray-400 hover:scale-105"
                        }`}
                      >
                        <FaChair className="text-lg" />
                        <span className="text-xs mt-1">{rowIndex + 1}-{colIndex + 3}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Seats Info & Action */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold">
                Seats Selected: <span className="text-red-600">{selectedSeats.length}</span>
              </p>
              {selectedSeats.length > 0 && (
                <p className="text-gray-600">
                  Seats: {selectedSeats.sort().join(", ")}
                </p>
              )}
              <p className="text-xl font-bold text-green-600 mt-2">
                Total: ₹{(bus.seatInfo?.price || 0) * selectedSeats.length}
              </p>
            </div>

            <button
              onClick={finalizeBooking}
              disabled={selectedSeats.length === 0}
              className={`px-8 py-3 rounded-lg font-semibold transition ${
                selectedSeats.length === 0
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBookingPage;