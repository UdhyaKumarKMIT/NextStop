const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  mobileNo: { type: String, required: true, unique: true },
  altMobileNo: { type: String },
  dob: { type: Date },
  address: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  resetCode: { type: String },
  resetCodeExpiry: { type: Date },
  score: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  rewards: [{
    type: {
      type: String, // 'discount', 'voucher', etc.
      required: true
    },
    value: Number,
    description: String,
    expiresAt: Date,
    used: {
      type: Boolean,
      default: false
    }
  }],
  lastRewardDate: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
