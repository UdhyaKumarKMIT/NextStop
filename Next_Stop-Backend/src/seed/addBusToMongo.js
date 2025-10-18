const mongoose = require("mongoose");
const Bus = require("../models/Bus"); 


// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/NextStop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Example bus data (you can add 20-30 buses here)
const fs = require('fs');
const buses = JSON.parse(fs.readFileSync('../local_db/buses.json', 'utf-8'));

// Insert buses
const seedBuses = async () => {
  try {
    await Bus.deleteMany(); // optional: clear existing buses
    const result = await Bus.insertMany(buses);
    console.log(`${result.length} buses inserted`);
    mongoose.disconnect();
  } catch (err) {
    console.error("Error inserting buses:", err);
  }
};

seedBuses();
