const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["UPI", "Card", "Wallet"], required: true },
  status: { type: String, enum: ["Success", "Failed"], default: "Success" },
  transactionId: { type: String, unique: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
