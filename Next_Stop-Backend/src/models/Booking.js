const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  seatsBooked: { type: Number, required: true },
  totalFare: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Booked", "Cancelled"], default: "Booked" }
});

module.exports = mongoose.model("Booking", bookingSchema);
