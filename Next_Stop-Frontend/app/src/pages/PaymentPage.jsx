import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get all the data passed from SeatBookingPage
  const { 
    bus, 
    journeyDate, 
    selectedSeats, 
    totalPrice, 
    seatPrice 
  } = location.state || {};

  const [passengerDetails, setPassengerDetails] = useState([]);

  // Initialize passenger details based on selected seats
  useEffect(() => {
    if (selectedSeats && selectedSeats.length > 0) {
      setPassengerDetails(
        selectedSeats.map(seat => ({ 
          seatNumber: seat,
          name: "", 
          age: "", 
          gender: "", 
          phone: "" 
        }))
      );
    }
  }, [selectedSeats]);

  // Handle input change for passenger details
  const handleChange = (index, field, value) => {
    const updatedDetails = [...passengerDetails];
    updatedDetails[index][field] = value;
    setPassengerDetails(updatedDetails);
  };

  // Check if all mandatory fields are filled
  const isFormValid = passengerDetails.every(
    (p) => p.name && p.age && p.gender && p.phone
  );

  const handlePayment = () => {
    if (!isFormValid) {
      alert("Please fill all passenger details before proceeding.");
      return;
    }

    console.log("Processing payment with data:", {
      bus,
      journeyDate,
      selectedSeats,
      passengerDetails,
      totalPrice,
      seatPrice
    });

    // Navigate to final confirmation/payment page
    navigate("/finalize-payment", {
      state: {
        bus,
        journeyDate,
        selectedSeats,
        passengerDetails,
        totalPrice,
        seatPrice
      }
    });
  };

  // If no data is passed, redirect back
  if (!bus || !selectedSeats) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            No Booking Data Found
          </h1>
          <button 
            onClick={() => navigate("/booking")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Go Back to Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50">
      <Navbar />
      
      <div className="pt-24 px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Booking Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">
              Passenger Details & Payment
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {bus.busName} - {bus.type}
                </h2>
                <p className="text-gray-600">
                  <strong>Route:</strong> {bus.route.source} → {bus.route.destination}
                </p>
                <p className="text-gray-600">
                  <strong>Date:</strong> {new Date(journeyDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <strong>Distance:</strong> {bus.route.distance} km
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Booking Summary</h3>
                <p className="text-gray-600">
                  <strong>Selected Seats:</strong> {selectedSeats.sort().join(", ")}
                </p>
                <p className="text-gray-600">
                  <strong>Seat Price:</strong> ₹{seatPrice}
                </p>
                <p className="text-gray-600">
                  <strong>Number of Passengers:</strong> {selectedSeats.length}
                </p>
                <p className="text-xl font-bold text-green-600 mt-2">
                  Total Amount: ₹{totalPrice}
                </p>
              </div>
            </div>
          </div>

          {/* Passenger Details Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">
              Passenger Information
            </h2>

            <form className="space-y-6">
              {passengerDetails.map((passenger, index) => (
                <div
                  key={passenger.seatNumber}
                  className="border-2 border-gray-200 p-6 rounded-lg bg-gray-50 hover:border-red-300 transition"
                >
                  <h3 className="font-semibold text-red-500 text-lg mb-4">
                    Passenger {index + 1} - Seat: {passenger.seatNumber}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={passenger.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age *
                      </label>
                      <input
                        type="number"
                        placeholder="Enter age"
                        value={passenger.age}
                        onChange={(e) => handleChange(index, "age", e.target.value)}
                        min="1"
                        max="100"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender *
                      </label>
                      <select
                        value={passenger.gender}
                        onChange={(e) => handleChange(index, "gender", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={passenger.phone}
                        onChange={(e) => handleChange(index, "phone", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </form>
          </div>

          {/* Action Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-lg font-semibold">
                  Total Passengers: <span className="text-red-600">{selectedSeats.length}</span>
                </p>
                <p className="text-xl font-bold text-green-600">
                  Total Amount: ₹{totalPrice}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  Go Back
                </button>
                
                <button
                  onClick={handlePayment}
                  disabled={!isFormValid}
                  className={`px-8 py-3 rounded-lg font-semibold transition ${
                    isFormValid
                      ? "bg-red-600 text-white hover:bg-red-700 transform hover:scale-105"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>

            {!isFormValid && (
              <p className="text-red-500 text-center mt-4">
                * Please fill all passenger details to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;