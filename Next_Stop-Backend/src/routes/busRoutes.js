const express = require("express");
const router = express.Router();
const {
  addBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
  searchBuses,
} = require("../controllers/busController");

const { authBooking } = require("../models/middleware/authMiddleware");
const { adminCheck } = require("../models/middleware/adminMiddleware");

// Public routes
router.get("/", getAllBuses);
router.get("/search", searchBuses); 
router.get("/:id", getBusById);

// Admin protected routes
router.post("/add", authBooking, adminCheck, addBus);
router.put("/:id", authBooking, adminCheck, updateBus);
router.delete("/:id", authBooking, adminCheck, deleteBus);

module.exports = router;
