const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNo: { type: String, required: true },
  altMobileNo: { type: String }, 
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  resetCode: { type: String },
  resetCodeExpiry: { type: Date }
}, { timestamps: true }); 

module.exports = mongoose.model('User', UserSchema);
