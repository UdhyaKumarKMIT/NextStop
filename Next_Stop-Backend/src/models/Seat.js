const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  busNumber: { type: String, required: true }, // references Bus.busNumber
  totalSeats: { type: Number, required: true },
  date: { type: Date, required: true },
  availableSeats: { type: Number, required: true },
  seats: { type: String, required: true }, // e.g. "1-1,1-2,1-3"
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Seat", seatSchema);