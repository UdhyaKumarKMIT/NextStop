const Bus = require("../models/Bus");
const Route = require("../models/Route");

// ✅ Add new bus (Admin only)
const addBus = async (req, res) => {
  try {
    const { busNumber, routeId } = req.body;

    // Check if bus already exists
    const existingBus = await Bus.findOne({ busNumber });
    if (existingBus) {
      return res.status(400).json({ message: "Bus with this number already exists" });
    }

    // Validate routeId
    const route = await Route.findOne({ routeId });
    if (!route) {
      return res.status(404).json({ message: "Invalid routeId. Please create the route first." });
    }

    // Create bus
    const bus = await Bus.create({
      ...req.body,
      routeId: route.routeId, // ensure routeId is linked correctly
    });

    res.status(201).json({ message: "Bus added successfully", bus });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find(); // no populate

    // Optionally attach route details manually
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


// ✅ Get bus by busNumber (Primary Key)
const getBusByNumber = async (req, res) => {
  try {
    const { id: busNumber } = req.params;
    const trimmedBusNumber = busNumber.trim();

    console.log("Fetching Bus with number:", trimmedBusNumber);

    const bus = await Bus.findOne({ busNumber: { $regex: `^${trimmedBusNumber}$`, $options: "i" } });
    console.log("Fetched Bus:", bus);

    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const route = await Route.findOne({ routeId: bus.routeId });
    const busWithRoute = { ...bus.toObject(), route };

    res.status(200).json({ bus: busWithRoute });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ✅ Update bus info (Admin)
// ✅ Update bus info (Admin)
const updateBus = async (req, res) => {
  try {
    const { busNumber } = req.params; // <-- from the route /:busNumber
    const trimmedBusNumber = busNumber.trim(); // <-- define it!

    console.log("Updating Bus:", trimmedBusNumber);

    const bus = await Bus.findOneAndUpdate(
      { busNumber: { $regex: `^${trimmedBusNumber}$`, $options: "i" } },
      req.body,
      { new: true }
    );

    if (!bus) return res.status(404).json({ message: "Bus not found" });

    res.status(200).json({ message: "Bus updated successfully", bus });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// ✅ Delete bus (Admin)
const deleteBus = async (req, res) => {
  try {
    const { busNumber } = req.params;
    
    const bus = await Bus.findOneAndDelete({ busNumber });
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// ✅ Search buses by origin, destination, or busType
const searchBuses = async (req, res) => {
  try {
    let { source, destination, type } = req.query;

    // Trim any extra spaces or newlines
    source = source?.trim();
    destination = destination?.trim();
    type = type?.trim();

    console.log("=== Search Buses Debug ===");
    console.log("Received query params:", { source, destination, type });

    if (!source || !destination) {
      console.warn("Missing source or destination!");
      return res.status(400).json({ message: "Please provide source and destination" });
    }

    // Step 1: Find route
    const route = await Route.findOne({ source, destination });
    console.log("Route found:", route);

    if (!route) {
      console.warn("No route found for given source/destination");
      return res.status(404).json({
        message: "No route found for the given source and destination",
      });
    }

    // Step 2: Build query for buses
    const query = { routeId: route.routeId };
    if (type) query.type = type;
    console.log("Bus query:", query);

    // Step 3: Find buses
    const buses = await Bus.find(query);
    console.log("Buses found:", buses);

    if (!buses.length) {
      console.warn("No buses found for the selected route/type");
      return res.status(404).json({
        message: "No buses found for the selected route/type",
      });
    }

    // Step 4: Attach route info to each bus for clarity
    const busesWithRoute = buses.map(bus => ({ ...bus.toObject(), route }));
    console.log("Final buses with route info:", busesWithRoute);

    res.status(200).json({ buses: busesWithRoute });

  } catch (err) {
    console.error("Search Buses Error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
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
