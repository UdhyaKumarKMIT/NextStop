import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TicketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const bookingData = location.state || {};
  
  // Extract data
  const {
    selectedSeats = [],
    passengerDetails = [],
    busName,
    busNumber,
    from,
    to,
    journeyDate,
    totalPrice,
    finalAmount,
    ticketId,
    operators = {},
    booking = {}
  } = bookingData;

  const seats = selectedSeats.length > 0 ? selectedSeats : 
                booking?.seatNumbers || ["N/A"];

  const displayBusName = busName || bookingData.bus?.busName || "Bus Name Not Available";
  const displayFrom = from || bookingData.bus?.route?.source || "Source Not Available";
  const displayTo = to || bookingData.bus?.route?.destination || "Destination Not Available";
  const displayBusNumber = busNumber || bookingData.bus?.busNumber || "N/A";
  
  const displayDate = journeyDate ? new Date(journeyDate).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : "Date Not Specified";
  
  const displayAmount = finalAmount || totalPrice || booking?.totalFare || 0;
  const displayTicketId = ticketId || booking?._id || "N/A";

  const generateQRUrl = () => {
    const qrData = {
      ticketId: displayTicketId,
      bus: displayBusName,
      busNumber: displayBusNumber,
      from: displayFrom,
      to: displayTo,
      date: displayDate,
      seats: seats.join(', '),
      amount: displayAmount
    };
    return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(JSON.stringify(qrData))}`;
  };

  const qrUrl = bookingData.qrUrl || generateQRUrl();

  const handlePrint = () => {
    window.print();
  };

  const handleBackToHome = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 print:shadow-none print:border print:rounded-none print:max-w-none print:w-full print:h-full print:p-4">
        {/* Compact Header */}
        <div className="text-center mb-4 border-b pb-3 print:pb-2 print:mb-2">
          <h1 className="text-xl font-bold text-red-600 print:text-lg">🎟️ Bus Ticket</h1>
          <p className="text-sm text-gray-600 mt-1 print:text-xs">Booking Confirmed</p>
        </div>

        {/* Compact Ticket Details */}
        <div className="space-y-3 mb-4 print:space-y-2 print:mb-3">
          {/* Ticket ID */}
          <div className="bg-red-50 p-2 rounded-lg text-center print:p-1">
            <p className="text-xs text-gray-600 print:text-xs">Ticket ID</p>
            <p className="font-bold text-red-600 text-sm print:text-sm">#{displayTicketId}</p>
          </div>

          {/* Bus Information - More Compact */}
          <div className="grid grid-cols-2 gap-3 print:gap-2">
            <div>
              <p className="text-xs text-gray-600 print:text-xs">Bus</p>
              <p className="font-semibold text-sm print:text-sm">{displayBusName}</p>
              <p className="text-xs text-gray-500 print:text-xs">{displayBusNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 print:text-xs">Route</p>
              <p className="font-semibold text-sm print:text-sm">{displayFrom} → {displayTo}</p>
            </div>
          </div>

          {/* Journey Details */}
          <div className="grid grid-cols-2 gap-3 print:gap-2">
            <div>
              <p className="text-xs text-gray-600 print:text-xs">Date</p>
              <p className="font-semibold text-sm print:text-sm">{displayDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 print:text-xs">Amount</p>
              <p className="font-semibold text-green-600 text-sm print:text-sm">₹{displayAmount}</p>
            </div>
          </div>

          {/* Seats Information */}
          <div className="bg-gray-50 p-2 rounded-lg print:p-1">
            <p className="text-xs text-gray-600 mb-1 print:text-xs">Seats</p>
            <p className="font-semibold text-sm print:text-sm">
              {seats.join(", ")}
            </p>
          </div>

          {/* Compact Passenger Details */}
          {passengerDetails && passengerDetails.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 mb-1 print:text-xs">Passengers</p>
              <div className="space-y-1 print:space-y-0.5">
                {passengerDetails.slice(0, 3).map((passenger, index) => ( // Limit to 3 passengers for print
                  <div key={index} className="bg-gray-50 p-2 rounded border text-xs print:p-1 print:text-xs">
                    <p className="font-medium text-gray-800">{passenger.name}</p>
                    <p className="text-gray-600">
                      {passenger.age}y, {passenger.gender}, Seat: {passenger.seatNumber || seats[index] || "N/A"}
                    </p>
                  </div>
                ))}
                {passengerDetails.length > 3 && (
                  <div className="bg-yellow-50 p-1 rounded text-center print:text-xs">
                    <p className="text-yellow-700">+{passengerDetails.length - 3} more passengers</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Compact QR Code */}
        <div className="text-center border-t pt-4 print:pt-2">
          <p className="text-xs text-gray-600 mb-2 print:text-xs">Verification QR Code</p>
          <img 
            src={qrUrl} 
            alt="Ticket QR Code" 
            className="mx-auto border border-gray-300 rounded-lg w-28 h-28 print:w-24 print:h-24"
          />
        </div>

        {/* Compact Contact Information */}
        {(operators.name1 || bookingData.operators?.name1) && (
          <div className="mt-4 pt-3 border-t print:mt-2 print:pt-1">
            <p className="text-xs text-gray-600 mb-1 print:text-xs">Contact</p>
            <div className="text-xs text-gray-600 space-y-0.5 print:text-xs">
              {(operators.name1 || bookingData.operators?.name1) && (
                <p>{operators.name1 || bookingData.operators?.name1}: {operators.phone1 || bookingData.operators?.phone1}</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-6 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button
            onClick={handleBackToHome}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Profile
          </button>
        </div>

        {/* Print-only footer */}
        <div className="hidden print:block text-center mt-3">
          <p className="text-xs text-gray-500">
            Official Bus Ticket • Valid ID Required • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          .print\\:bg-white, .print\\:bg-white * {
            visibility: visible;
          }
          
          .print\\:bg-white {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0.5cm;
            box-shadow: none;
            border: 1px solid #000 !important;
            border-radius: 0 !important;
          }
          
          /* Hide unnecessary elements */
          .print\\:bg-white .print\\:hidden {
            display: none !important;
          }
          
          /* Ensure text is readable */
          .print\\:bg-white * {
            color: black !important;
            font-size: 12px !important;
            line-height: 1.2 !important;
          }
          
          /* Compact layout for print */
          .print\\:bg-white > div {
            max-height: 100% !important;
            overflow: hidden !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TicketPage;