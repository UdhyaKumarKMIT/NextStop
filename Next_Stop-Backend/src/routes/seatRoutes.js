const express = require("express");
const router = express.Router();

const { availabilityController } = require("../controllers/seatController");


// Get seat availability for a specific bus and date
router.get('/availability', availabilityController);

module.exports = router;