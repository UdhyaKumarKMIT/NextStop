import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TicketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    seats,
    passengerDetails = [],
    busName,
    from,
    to,
    date,
    finalAmount,
    ticketId,
    qrUrl,
  } = location.state || {};

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-red-600 text-center mb-6">🎟️ Your Bus Ticket</h1>

        {/* Ticket Details */}
        <div className="border border-red-200 rounded-lg p-6 mb-6">
          <p><strong>Bus:</strong> {busName}</p>
          <p><strong>From:</strong> {from}</p>
          <p><strong>To:</strong> {to}</p>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Seats:</strong> {seats?.join(", ")}</p>

          <div className="mt-3">
            <strong>Passengers:</strong>
            <ul className="list-disc ml-6">
              {passengerDetails.map((p, idx) => (
                <li key={idx}>{p.name} (Age: {p.age}, Gender: {p.gender})</li>
              ))}
            </ul>
          </div>

          <p className="mt-2"><strong>Ticket ID:</strong> #{ticketId}</p>
          <p className="mt-2"><strong>Amount:</strong> ₹{finalAmount}</p>

          {/* QR Code */}
          <div className="mt-4 text-center">
            <img src={qrUrl} alt="Ticket QR Code" className="mx-auto" />
            <p className="text-sm text-gray-500 mt-1">Scan this QR to view your ticket</p>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrint}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Print Ticket
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
