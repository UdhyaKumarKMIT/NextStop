import React, { useState } from "react";
import { FaChair } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SeatBookingPage = () => {
  const navigate = useNavigate();

  // Mock seat layout (rows x cols)
  const rows = 8; // 8 rows
  const cols = 4; // 4 seats per row (2 left + aisle + 2 right)
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Example of already booked seats (from DB later)
  const bookedSeats = ["1-2", "3-1", "5-3"];

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return; // can't select booked seats

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const finalizeBooking = () => {
    // redirect to payment with selected seats
    navigate("/payment", { state: { seats: selectedSeats } });
  };

  return (
    <div className="min-h-screen bg-red-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-red-600 mb-6">
        Select Your Seats
      </h1>

      {/* Bus Layout */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col gap-4">
          {[...Array(rows)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-8">
              {/* Left side (2 seats) */}
              <div className="flex gap-4">
                {[...Array(2)].map((_, colIndex) => {
                  const seatId = `${rowIndex + 1}-${colIndex + 1}`;
                  const isBooked = bookedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <div
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      className={`flex justify-center items-center w-12 h-12 rounded-lg cursor-pointer transition
                        ${
                          isBooked
                            ? "bg-red-600 cursor-not-allowed"
                            : isSelected
                            ? "bg-green-500"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                    >
                      <FaChair className="text-white" />
                    </div>
                  );
                })}
              </div>

              {/* Right side (2 seats) */}
              <div className="flex gap-4">
                {[...Array(2)].map((_, colIndex) => {
                  const seatId = `${rowIndex + 1}-${colIndex + 3}`; // 3rd & 4th seat
                  const isBooked = bookedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <div
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      className={`flex justify-center items-center w-12 h-12 rounded-lg cursor-pointer transition
                        ${
                          isBooked
                            ? "bg-red-600 cursor-not-allowed"
                            : isSelected
                            ? "bg-green-500"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                    >
                      <FaChair className="text-white" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Seats Info */}
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold">
          Seats Selected:{" "}
          <span className="text-red-600">{selectedSeats.length}</span>
        </p>
      </div>

      {/* Finalize Button */}
      <button
        onClick={finalizeBooking}
        disabled={selectedSeats.length === 0}
        className={`mt-4 px-8 py-3 rounded-lg font-semibold transition ${
          selectedSeats.length === 0
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        Finalize & Book
      </button>
    </div>
  );
};

export default SeatBookingPage;
