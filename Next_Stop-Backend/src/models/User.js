const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {type: String, required: true, enum: ['user', 'admin'], default: 'user' },
  resetCode: { type: String },
  resetCodeExpiry: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);