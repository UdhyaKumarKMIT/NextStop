const Bus = require("../models/Bus");
const Route = require("../models/Route");

// Add new bus (Admin only)
const addBus = async (req, res) => {
  try {
    const { busNumber } = req.body;
    const existingBus = await Bus.findOne({ busNumber });
    if (existingBus) {
      return res.status(400).json({ message: "Bus with this number already exists" });
    }

    const bus = await Bus.create(req.body);
    res.status(201).json({ message: "Bus added successfully", bus });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all buses (Public)
const getAllBuses = async (req, res) => {
  try {
    //const buses = await Bus.find().populate("route");
    const buses = await Bus.find();
    res.json({ buses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get bus by ID
const getBusById = async (req, res) => {
  try {
    //const bus = await Bus.findById(req.params.id).populate("route");
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json({ bus });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update bus info (Admin)
const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json({ message: "Bus updated successfully", bus });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete bus (Admin)
const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json({ message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const searchBuses = async (req, res) => {
  try {
    const { startPoint, endPoint, date, type } = req.query;

    if (!startPoint || !endPoint || !date) {
      return res.status(400).json({
        message: "Please provide startPoint, endPoint, and date",
      });
    }

    // ✅ Step 1: Parse and validate the date
    const searchDate = new Date(date);
    if (isNaN(searchDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Create start and end of the day range (to ignore time differences)
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

    // ✅ Step 2: Find route ID matching start and end points
    const route = await Route.findOne({ startPoint, endPoint });
    if (!route) {
      return res.status(404).json({
        message: "No route found for the given start and end points",
      });
    }

    // ✅ Step 3: Build query
    const query = {
      route: route._id,
      date: { $gte: startOfDay, $lte: endOfDay },
      availableSeats: { $gt: 0 },
    };

    if (type) query.type = type;

    // ✅ Step 4: Find buses
    //const buses = await Bus.find(query).populate("route");
    const buses = await Bus.find(query);
    if (!buses.length) {
      return res.status(404).json({
        message: "No buses found for the selected route/date/type",
      });
    }

    res.status(200).json({ buses });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  addBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
  searchBuses,
};
