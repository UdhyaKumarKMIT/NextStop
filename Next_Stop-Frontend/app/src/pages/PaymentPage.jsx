import React, { useState } from "react";
import { useLocation , useNavigate } from "react-router-dom";



const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const seats = location.state?.seats || [];

  // Store passenger details for each seat
  const [passengerDetails, setPassengerDetails] = useState(
    seats.map(() => ({ name: "", age: "", gender: "", phone: "" }))
  );

  // Handle input change
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
    if (!isFormValid) return; // Just in case
    console.log("Proceeding with payment, passenger data:", passengerDetails);
    // 👉 Here you can integrate payment gateway logic

    navigate("/finalize-payment", {
      state: {
        seats,
        passengerDetails
      }
    });
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">
          Passenger Details
        </h1>

        <form className="space-y-6">
          {seats.map((seat, index) => (
            <div
              key={seat}
              className="border p-4 rounded-lg shadow-sm bg-gray-50"
            >
              <h2 className="font-semibold text-red-500 mb-2">
                Seat: {seat}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={passengerDetails[index].name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="border rounded-lg px-3 py-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={passengerDetails[index].age}
                  onChange={(e) => handleChange(index, "age", e.target.value)}
                  className="border rounded-lg px-3 py-2"
                  required
                />
                <select
                  value={passengerDetails[index].gender}
                  onChange={(e) => handleChange(index, "gender", e.target.value)}
                  className="border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={passengerDetails[index].phone}
                  onChange={(e) => handleChange(index, "phone", e.target.value)}
                  className="border rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>
          ))}
        </form>

        <div className="text-center mt-6">
          <button
            onClick={handlePayment}
            disabled={!isFormValid}
            className={`px-6 py-3 rounded-lg transition ${
              isFormValid
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
