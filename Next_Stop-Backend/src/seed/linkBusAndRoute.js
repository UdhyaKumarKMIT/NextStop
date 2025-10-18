const mongoose = require("mongoose");
const fs = require("fs");
const Bus = require("../models/Bus");
const Route = require("../models/Route");

// 1️⃣ Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/NextStop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 2️⃣ Load JSON data
const routes = JSON.parse(fs.readFileSync("./local_db/routes.json", "utf-8"));
const buses = JSON.parse(fs.readFileSync("./local_db/buses.json", "utf-8"));

const seedDatabase = async () => {
  try {
    // 3️⃣ Clear existing data
    await Route.deleteMany();
    await Bus.deleteMany();

    // 4️⃣ Insert routes
    const insertedRoutes = await Route.insertMany(routes);
    console.log(`${insertedRoutes.length} routes inserted`);

    // 5️⃣ Map route string to ObjectId
    const routeMap = {};
    insertedRoutes.forEach((route) => {
      const key = `${route.startPoint}-${route.endPoint}`;
      routeMap[key] = route._id;
    });

    // 6️⃣ Replace route string with ObjectId in buses
    const busesWithRouteIds = buses.map((bus) => {
      const routeId = routeMap[bus.route];
      if (!routeId) {
        console.warn(`Skipping bus ${bus.busNumber}: route not found (${bus.route})`);
        return null;
      }
      return { ...bus, route: routeId };
    }).filter(Boolean); // remove buses with missing routes

    // 7️⃣ Insert buses
    const insertedBuses = await Bus.insertMany(busesWithRouteIds);
    console.log(`${insertedBuses.length} buses inserted`);

    console.log("Database seeded successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

seedDatabase();
