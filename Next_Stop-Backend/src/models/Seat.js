const mongoose = require("mongoose");

const bookedSeatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  passengerName: { type: String }
});

const seatSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  date: { type: Date, required: true },
  seats: { type: [String], required: true }, // Available seats like ["1-1", "1-2"]
  bookedSeats: [bookedSeatSchema], // Track booked seats with details
  availableSeats: { type: Number, required: true }, //count of available seats
  totalSeats: { type: Number, required: true, default: 40 }, // Total seats in bus
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Seat", seatSchema);