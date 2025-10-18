const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  busName: { type: String, required: true },
  type: { type: String, enum: ["AC", "Non-AC", "Sleeper", "Seater"], required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  fare: { type: Number, required: true },
  from_route: { type: String, required: true },
  to_route: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Bus", busSchema);
