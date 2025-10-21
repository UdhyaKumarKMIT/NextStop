const Bus = require("../models/Bus");
const Route = require("../models/Route");
const Seat = require("../models/Seat");
// ✅ Add new bus (Admin only)
const addBus = async (req, res) => {
  try {
    const { busNumber, routeId } = req.body;

    // Check if bus already exists
    const existingBus = await Bus.findOne({
      busNumber: { $regex: `^${busNumber.trim()}$`, $options: "i" },
    });
    if (existingBus) {
      return res
        .status(400)
        .json({ message: "Bus with this number already exists" });
    }

    // Validate routeId
    const route = await Route.findOne({
      routeId: { $regex: `^${routeId.trim()}$`, $options: "i" },
    });
    if (!route) {
      return res
        .status(404)
        .json({ message: "Invalid routeId. Please create the route first." });
    }

    // Create bus
    const bus = await Bus.create({
      ...req.body,
      routeId: route.routeId, // ensure routeId is valid and linked
    });

    res.status(201).json({ message: "Bus added successfully", bus });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get all buses (with route info)
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();

    const busesWithRoute = await Promise.all(
      buses.map(async (bus) => {
        const route = await Route.findOne({ routeId: bus.routeId });
        return { ...bus.toObject(), route };
      })
    );

    res.status(200).json({ buses: busesWithRoute });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get bus by busNumber
const getBusByNumber = async (req, res) => {
  try {
    const trimmedBusNumber = req.params.busNumber.trim();

    console.log("Fetching bus:", trimmedBusNumber);

    const bus = await Bus.findOne({
      busNumber: { $regex: `^${trimmedBusNumber}$`, $options: "i" },
    });

    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const route = await Route.findOne({ routeId: bus.routeId });
    const busWithRoute = { ...bus.toObject(), route };

    res.status(200).json({ bus: busWithRoute });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update bus info (Admin only)
const updateBus = async (req, res) => {
  try {
    const trimmedBusNumber = req.params.busNumber.trim();
    console.log("Updating Bus:", trimmedBusNumber);
    console.log("Request Body:", req.body);

    // Prevent busNumber change
    const { busNumber, ...updateData } = req.body;

    // If routeId is being updated, validate it
    if (updateData.routeId) {
      const validRoute = await Route.findOne({
        routeId: { $regex: `^${updateData.routeId.trim()}$`, $options: "i" },
      });
      if (!validRoute) {
        return res.status(404).json({ message: "Invalid routeId" });
      }
      updateData.routeId = validRoute.routeId;
    }

    const bus = await Bus.findOneAndUpdate(
      { busNumber: { $regex: `^${trimmedBusNumber}$`, $options: "i" } },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!bus) return res.status(404).json({ message: "Bus not found" });

    res.status(200).json({ message: "Bus updated successfully", bus });
  } catch (err) {
    console.error("UpdateBus Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Delete bus (Admin only)
const deleteBus = async (req, res) => {
  try {
    const trimmedBusNumber = req.params.busNumber.trim();

    const bus = await Bus.findOneAndDelete({
      busNumber: { $regex: `^${trimmedBusNumber}$`, $options: "i" },
    });

    if (!bus) return res.status(404).json({ message: "Bus not found" });

    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ✅ Search buses by source, destination, type, and journey date
const searchBuses = async (req, res) => {
  try {
    let { source, destination, type, journeyDate } = req.query;

    source = source?.trim();
    destination = destination?.trim();
    type = type?.trim();

    if (!source || !destination || !journeyDate) {
      return res.status(400).json({
        message: "Please provide source, destination, and journey date",
      });
    }

    // Find the route
    const route = await Route.findOne({
      source: { $regex: `^${source}$`, $options: "i" },
      destination: { $regex: `^${destination}$`, $options: "i" },
    });

    if (!route) {
      return res.status(404).json({ message: "No route found" });
    }

    // Find buses
    const busQuery = { routeId: route.routeId };
    if (type) busQuery.type = { $regex: `^${type}$`, $options: "i" };
    console.log(busQuery)
    const buses = await Bus.find(busQuery);
    
    const busNumbers = buses.map(bus => bus.busNumber);
    console.log(busNumbers)
    if (!buses.length) {
      return res.status(404).json({ message: "No buses found" });
    }
    // Assuming busNumbers is an array of all busNumber strings
    const seats = await Promise.all(
      busNumbers.map(async (number) => {
        return await Seat.find({ busNumber: number });
      })
    );
    
    console.log(seats);
    
    // Parse journey date
    const startOfDay = new Date(journeyDate);  
    console.log(startOfDay)
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(journeyDate);
    endOfDay.setHours(23, 59, 59, 999);

    const busesWithSeats = await Promise.all(
      buses.map(async (bus) => {
        return {
          busNumber: bus.busNumber,
          busName: bus.busName,
          type: bus.type,
          operatorName1: bus.operatorName1,
          operatorPhone1: bus.operatorPhone1,
          operatorName2: bus.operatorName2,
          operatorPhone2: bus.operatorPhone2,
          route: {
            routeId: route.routeId,
            source: route.source,
            destination: route.destination,
            distance: route.distance,
            duration: route.duration,
          },
          seatInfo: seats || null,
        };
      })
    );

    res.status(200).json({ buses: busesWithSeats });
  } catch (err) {
    console.error("SearchBuses Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



module.exports = {
  addBus,
  getAllBuses,
  getBusByNumber,
  updateBus,
  deleteBus,
  searchBuses,
};
