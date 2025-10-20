const express = require("express");
const router = express.Router();
const {
  addBus,
  getAllBuses,
  getBusByNumber,
  updateBus,
  deleteBus,
  searchBuses,
} = require("../controllers/busController");

const { authBooking } = require("../models/middleware/authMiddleware");
const { adminCheck } = require("../models/middleware/adminMiddleware");

// Public 
router.get("/", getAllBuses);
router.get("/search", searchBuses); 
router.get("/:busNumber", getBusByNumber);

// Admin protected 
router.post("/add", authBooking, adminCheck, addBus);
router.put("/:busNumber", authBooking, adminCheck, updateBus);
router.delete("/:busNumber", authBooking, adminCheck, deleteBus);

module.exports = router;
