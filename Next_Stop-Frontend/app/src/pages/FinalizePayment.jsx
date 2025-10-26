import React from "react";

import { useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import Navbar from "../components/Navbar";
import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api";

const FinalizePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user=null;
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
       
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/auth/getUserProfile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        user = res.data.user;
          
        
      

      } catch (err) {
        console.error("Failed to fetch user:", err);
       
      } finally {
        
      }
    };

    fetchProfile();
  }, []);

  // Get all data passed from PaymentPage
  const {
    bus = {},
    journeyDate = "",
    selectedSeats = [],
    passengerDetails = [],
    totalPrice = 0,
    seatPrice = 0
  } = location.state || {};

  // Calculate discount and final amount
  const discount = totalPrice * 0.02; // 2% discount
  const finalAmount = totalPrice - discount;
  const ticketId = `TKT${Math.floor(100000 + Math.random() * 900000)}`;

  // Generate QR code data
  const ticketData = {
    ticketId,
    busName: bus.busName,
    busType: bus.type,
    busNumber: bus.busNumber,
    from: bus.route?.source,
    to: bus.route?.destination,
    journeyDate,
    selectedSeats,
    passengerDetails,
    totalPrice,
    seatPrice,
    discount,
    finalAmount,
    operators: {
      name1: bus.operatorName1,
      phone1: bus.operatorPhone1,
      name2: bus.operatorName2,
      phone2: bus.operatorPhone2
    }
  };

  const qrData = encodeURIComponent(JSON.stringify(ticketData));
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;

  const handlePayment = async () => {
    try {
      // First, create the booking in the database
      const bookingData = {
       
        busNumber: bus.busNumber,
        routeId: bus.route?.routeId,
        seatNumbers: selectedSeats,
        journeyDate: journeyDate,
        boardingPoint: bus.route?.source, // or make this dynamic based on user selection
        totalFare: finalAmount,
        passengerDetails: passengerDetails.map((passenger, index) => ({
          seatNumber: selectedSeats[index],
          name: passenger.name,
          age: passenger.age,
          gender: passenger.gender,
          phone: passenger.phone
        }))
      };

      console.log("Sending booking data:", bookingData);

      // Make API call to create booking
      const token = localStorage.getItem("token");
      const bookingResponse = await axios.post(
        "http://localhost:5050/api/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Booking API response:", bookingResponse.data);

      if (bookingResponse.data.message === "Booking successful") {
        const booking = bookingResponse.data.booking;
        
        // Prepare email content
        const passengerList = passengerDetails
          .map((p, index) => 
            `${p.name} (Seat: ${selectedSeats[index]}, Age: ${p.age}, Gender: ${p.gender}, Phone: ${p.phone})`
          )
          .join("\n");

        const templateParams = {
          to_name: passengerDetails[0]?.name || "Passenger",
          to_email: "malarvannanm11@gmail.com",
          bus_name: bus.busName,
          bus_type: bus.type,
          bus_number: bus.busNumber,
          from: bus.route?.source,
          to: bus.route?.destination,
          date: new Date(journeyDate).toLocaleDateString(),
          seats: selectedSeats.join(", "),
          passengers: passengerList,
          ticket_id: ticketId,
          total_amount: totalPrice,
          discount: discount,
          final_amount: finalAmount,
          operator1: `${bus.operatorName1} - ${bus.operatorPhone1}`,
          operator2: bus.operatorName2 ? `${bus.operatorName2} - ${bus.operatorPhone2}` : "N/A",
          qr_code_url: qrUrl,
          booking_id: booking._id // Include booking ID in email
        };

        // Send email using EmailJS
        emailjs
          .send(
            "service_iv6fxwn",   // EmailJS service ID
            "template_zfztbyl",  // EmailJS template ID
            templateParams,
            "bQLV-wFxJ_cfNWDs3"    // EmailJS public key
          )
          .then(() => {
            console.log("Ticket email sent successfully!");
            // Navigate to ticket page after successful email
            navigate("/ticket", { 
              state: { 
                ...ticketData, 
                qrUrl,
                emailSent: true,
                booking: booking // Include booking data in navigation
              } 
            });
          })
          .catch((err) => {
            console.log("Email sending failed:", err);
            // Still navigate to ticket page but with error flag
            navigate("/ticket", { 
              state: { 
                ...ticketData, 
                qrUrl,
                emailSent: false,
                emailError: err.message,
                booking: booking // Include booking data even if email fails
              } 
            });
          });
      } else {
        throw new Error(bookingResponse.data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      alert(`Booking failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // If no booking data found
  

  // If no booking data found
  if (!bus.busName || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-24">
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
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-2">
              Finalize Payment
            </h1>
            <p className="text-gray-600">
              Review your booking details and complete the payment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Booking Summary
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{bus.busName}</h3>
                  <p className="text-gray-600">{bus.type} • {bus.busNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Route</p>
                    <p className="font-semibold">
                      {bus.route?.source} → {bus.route?.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">
                      {new Date(journeyDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Selected Seats</p>
                  <p className="font-semibold text-lg">
                    {selectedSeats.sort().join(", ")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Passengers</p>
                  <div className="space-y-2 mt-2">
                    {passengerDetails.map((passenger, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {passenger.name} (Seat {selectedSeats[index]})
                        </span>
                        <span>₹{seatPrice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Payment Details
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Base Fare ({selectedSeats.length} seats)</span>
                  <span>₹{totalPrice}</span>
                </div>
                
                <div className="flex justify-between text-green-600">
                  <span>Discount (2%)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-green-600">₹{finalAmount.toFixed(2)}</span>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Ticket ID</p>
                  <p className="font-mono font-semibold">{ticketId}</p>
                </div>

                {/* QR Code Preview */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Your Ticket QR Code</p>
                  <img 
                    src={qrUrl} 
                    alt="Ticket QR Code" 
                    className="mx-auto border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This QR code will be sent to your email
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">{bus.operatorName1}</p>
                <p className="text-gray-600">{bus.operatorPhone1}</p>
              </div>
              {bus.operatorName2 && (
                <div>
                  <p className="font-semibold">{bus.operatorName2}</p>
                  <p className="text-gray-600">{bus.operatorPhone2}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Button */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8 text-center">
            <button
              onClick={handlePayment}
              className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition transform hover:scale-105 text-lg font-semibold"
            >
              Confirm & Pay ₹{finalAmount.toFixed(2)}
            </button>
            <p className="text-sm text-gray-500 mt-3">
              By proceeding, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalizePayment;