import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

const FinalizePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    seats = [],
    passengerDetails = [],
    busName = "KPN Travels",
    from = "Chennai",
    to = "Bangalore",
    date = "2025-09-18",
  } = location.state || {};

  const seatPrice = 200;
  const totalPrice = seats.length * seatPrice;
  const discount = totalPrice * 0.02;
  const finalAmount = totalPrice - discount;

  const ticketId = Math.floor(Math.random() * 1000000);

  // Generate QR code URL using API
  const ticketData = {
    seats,
    passengerDetails,
    busName,
    from,
    to,
    date,
    finalAmount,
    ticketId,
  };
  const qrData = encodeURIComponent(JSON.stringify(ticketData));
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;

  const handlePayment = () => {
    // Send email automatically via EmailJS
    const passengerList = passengerDetails
      .map((p) => `<li>${p.name} (Age: ${p.age}, Gender: ${p.gender})</li>`)
      .join("");

    const templateParams = {
      to_name: passengerDetails[0]?.name || "Passenger",
      to_email: "malarvannanm11@gmail.com",
      bus_name: busName,
      from,
      to,
      date,
      seats: seats.join(", "),
      passengers: passengerList,
      ticket_id: ticketId,
      amount: finalAmount,
      qr_code_url: qrUrl,
    };

    emailjs
      .send(
        "service_iv6fxwn",   // EmailJS service ID
        "template_zfztbyl",  // EmailJS template ID
        templateParams,
        "bQLV-wFxJ_cfNWDs3"    // EmailJS public key
      )
      .then(() => console.log("Ticket email sent successfully!"))
      .catch((err) => console.log("Email sending failed:", err));

    // Navigate to TicketPage with all ticket info
    navigate("/ticket", { state: { ...ticketData, qrUrl } });
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-6">Finalize Payment</h1>
        <p>Seats: {seats.join(", ")}</p>
        <p>Total Price: ₹{totalPrice}</p>
        <p>Discount (2%): ₹{discount}</p>
        <p className="font-semibold">Final Amount: ₹{finalAmount}</p>

        <button
          onClick={handlePayment}
          className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
        >
          Submit Payment
        </button>

        <div className="mt-6">
          <h3 className="mb-2">QR Code</h3>
          <img src={qrUrl} alt="Ticket QR Code" className="mx-auto" />
          <p className="text-sm text-gray-500 mt-1">
            QR code will also be sent via email
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalizePayment;
