const Seat = require("../models/Seat");

const availabilityController = async (req, res) => {
    try {
    const { busNumber, date } = req.query;
    
    if (!busNumber || !date) {
      return res.status(400).json({
        success: false,
        message: 'Bus number and date are required'
      });
    }

    const seatData = await Seat.findOne({ 
      busNumber, 
      date: new Date(date) 
    });

    if (!seatData) {
      return res.status(404).json({ 
        success: false,
        message: 'Seat data not found for this bus and date' 
      });
    }

    res.json({
      success: true,
      data: seatData
    });
  } catch (error) {
    console.error('Seat availability error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

module.exports = {
  availabilityController
};