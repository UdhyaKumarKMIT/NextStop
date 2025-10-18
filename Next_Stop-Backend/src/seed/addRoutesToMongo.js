const mongoose = require("mongoose");
const Route = require("../models/Route"); 


// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/NextStop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Example bus data (you can add 20-30 buses here)
const fs = require('fs');
const routes = JSON.parse(fs.readFileSync('../local_db/routes.json', 'utf-8'));

// Insert buses
const seedRoutes = async () => {
  try {
    await Route.deleteMany(); // optional: clear existing buses
    const result = await Route.insertMany(routes);
    console.log(`${result.length} buses inserted`);
    mongoose.disconnect();
  } catch (err) {
    console.error("Error inserting buses:", err);
  }
};

seedRoutes();
