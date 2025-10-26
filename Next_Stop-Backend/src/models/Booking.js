const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  phone: { type: String, required: true }
});

const bookingSchema = new mongoose.Schema({
  username: { type: String, required: true },
  busNumber: { type: String, required: true },
  routeId: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  seatNumbers: { type: [String], required: true },
  passengerDetails: [passengerSchema], // ✅ Array of passenger objects
  totalFare: { type: Number, required: true },
  journeyDate: { type: Date, required: true },
  boardingPoint: { type: String, required: true },
  bookingStatus: { 
    type: String, 
    enum: ["Confirmed", "Pending", "Cancelled"], 
    default: "Confirmed" 
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);