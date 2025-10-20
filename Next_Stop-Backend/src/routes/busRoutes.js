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

const { authBooking } = require("../models/middleware/authMiddleware"); // Temporary auth
const { adminCheck } = require("../models/middleware/adminMiddleware"); // Admin only

// 🚌 Public routes
router.get("/", getAllBuses);
router.get("/search", searchBuses);
router.get("/:busNumber", getBusByNumber);

// 🛠️ Admin protected routes
router.post("/add", authBooking, adminCheck, addBus);
router.put("/:busNumber", authBooking, adminCheck, updateBus);
router.delete("/:busNumber", authBooking, adminCheck, deleteBus);

module.exports = router;
