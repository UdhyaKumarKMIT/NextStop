const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  startPoint: { type: String, required: true },
  endPoint: { type: String, required: true },
  distance: { type: Number },
  duration: { type: String },
});

module.exports = mongoose.model("Routes", routeSchema);
