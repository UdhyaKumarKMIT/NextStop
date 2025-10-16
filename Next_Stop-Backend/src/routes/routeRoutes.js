// routes/routeRoutes.js
const express = require("express");
const router = express.Router();
const {
  addRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute
} = require("../controllers/routeController");

const { authBooking } = require("../models/middleware/authMiddleware"); // Temporary auth
const { adminCheck } = require("../models/middleware/adminMiddleware"); // Admin only

// Public routes
router.get("/", getAllRoutes);
router.get("/:id", getRouteById);

// Admin protected routes
router.post("/add", authBooking, adminCheck, addRoute);
router.put("/:id", authBooking, adminCheck, updateRoute);
router.delete("/:id", authBooking, adminCheck, deleteRoute);

module.exports = router;
