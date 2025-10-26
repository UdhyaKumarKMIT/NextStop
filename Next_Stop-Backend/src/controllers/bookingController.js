const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const Seat = require("../models/Seat");

// ---------------- BOOK A TICKET ----------------
const bookTicket = async (req, res) => {
  try {
    const { 
      busNumber, 
      routeId, 
      seatNumbers, 
      journeyDate, 
      boardingPoint,
      passengerDetails,
      totalFare 
    } = req.body;
    
    const username = req.user.username;

    // Validate required fields
    if (!busNumber || !routeId || !seatNumbers || !journeyDate || !boardingPoint || !passengerDetails) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required booking details" 
      });
    }

    // Normalize seat numbers
    let selectedSeats = [];
    if (typeof seatNumbers === "string") {
      if (seatNumbers.includes(",")) {
        selectedSeats = seatNumbers.split(",").map(s => s.trim());
      } else if (seatNumbers.startsWith("[") && seatNumbers.endsWith("]")) {
        const cleanString = seatNumbers.replace(/[\[\]]/g, '');
        selectedSeats = cleanString.split(",").map(s => s.trim().replace(/"/g, ''));
      } else {
        selectedSeats = [seatNumbers.trim()];
      }
    } else if (Array.isArray(seatNumbers)) {
      selectedSeats = seatNumbers.map(s => s.toString().trim());
    } else {
      return res.status(400).json({ 
        success: false,
        message: "Invalid seatNumbers format" 
      });
    }

    console.log("Processing booking for seats:", selectedSeats);

    // Validate passenger details match selected seats
    if (passengerDetails.length !== selectedSeats.length) {
      return res.status(400).json({ 
        success: false,
        message: "Passenger details count must match selected seats count" 
      });
    }

    // Fetch bus and route
    const bus = await Bus.findOne({ busNumber });
    if (!bus) return res.status(404).json({ 
      success: false,
      message: "Bus not found" 
    });

    const route = await Route.findOne({ routeId });
    if (!route) return res.status(404).json({ 
      success: false,
      message: "Route not found" 
    });

    // Get seat data for that date
    const seatData = await Seat.findOne({ busNumber, date: new Date(journeyDate) });
    if (!seatData) {
      return res.status(404).json({ 
        success: false,
        message: "Seat data not found for this date. Please check bus schedule." 
      });
    }

    console.log("Available seats:", seatData.seats);
    console.log("Booked seats:", seatData.bookedSeats.map(bs => bs.seatNumber));

    // Check seat availability
    const bookedSeatNumbers = seatData.bookedSeats.map(bs => bs.seatNumber);
    const unavailableSeats = [];

    selectedSeats.forEach(seat => {
      if (!seatData.seats.includes(seat) || bookedSeatNumbers.includes(seat)) {
        unavailableSeats.push(seat);
      }
    });

    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: `Seats ${unavailableSeats.join(", ")} are not available` 
      });
    }

    // Verify we have enough available seats
    if (seatData.availableSeats < selectedSeats.length) {
      return res.status(400).json({ 
        success: false,
        message: `Only ${seatData.availableSeats} seats available, but trying to book ${selectedSeats.length}` 
      });
    }

    // Create booking first
    const newBooking = new Booking({
      username: username,
      busNumber: busNumber,
      routeId: routeId,
      totalSeats: selectedSeats.length,
      seatNumbers: selectedSeats,
      passengerDetails: passengerDetails.map((passenger, index) => ({
        seatNumber: selectedSeats[index],
        name: passenger.name,
        age: passenger.age,
        gender: passenger.gender,
        phone: passenger.phone
      })),
      totalFare: totalFare,
      journeyDate: journeyDate,
      boardingPoint: boardingPoint,
      bookingStatus: "Confirmed",
    });
    
    const savedBooking = await newBooking.save();
    console.log("Booking saved successfully with ID:", savedBooking._id);

    // Update seat availability after successful booking
    seatData.seats = seatData.seats.filter(s => !selectedSeats.includes(s));
    seatData.availableSeats -= selectedSeats.length;
    
    // Add booked seats to bookedSeats array
    const newBookedSeats = selectedSeats.map((seat, index) => ({
      seatNumber: seat,
      bookingId: savedBooking._id,
      passengerName: passengerDetails[index]?.name || `Passenger_${seat}`
    }));
    
    // Remove any existing entries for these seats and add new ones
    seatData.bookedSeats = seatData.bookedSeats.filter(
      bs => !selectedSeats.includes(bs.seatNumber)
    );
    seatData.bookedSeats.push(...newBookedSeats);
    
    await seatData.save();

    res.status(201).json({
      success: true,
      message: "Booking successful",
      booking: savedBooking,
    });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};

// ---------------- CANCEL BOOKING ----------------
const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: "Booking not found" 
      });
    }

    if (booking.username !== req.user.username) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized to cancel this booking" 
      });
    }

    if (booking.bookingStatus === "Cancelled") {
      return res.status(400).json({ 
        success: false,
        message: "Booking is already cancelled" 
      });
    }

    const seatData = await Seat.findOne({ 
      busNumber: booking.busNumber, 
      date: booking.journeyDate 
    });
    
    if (seatData) {
      // Restore seats to available seats
      booking.seatNumbers.forEach(seat => {
        if (!seatData.seats.includes(seat)) {
          seatData.seats.push(seat);
        }
      });
      
      // Remove from bookedSeats
      seatData.bookedSeats = seatData.bookedSeats.filter(
        bookedSeat => !booking.seatNumbers.includes(bookedSeat.seatNumber)
      );
      
      seatData.availableSeats += booking.seatNumbers.length;
      
      // Sort seats for better organization
      seatData.seats.sort((a, b) => {
        const [aRow, aNum] = a.split('-').map(Number);
        const [bRow, bNum] = b.split('-').map(Number);
        return aRow - bRow || aNum - bNum;
      });
      
      await seatData.save();
    }

    booking.bookingStatus = "Cancelled";
    await booking.save();

    res.json({ 
      success: true,
      message: "Booking cancelled successfully", 
      booking 
    });
  } catch (err) {
    console.error("Cancel Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};

// ---------------- GET USER BOOKINGS ----------------
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ username: req.user.username })
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true,
      bookings 
    });
  } catch (err) {
    console.error("Get Bookings Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};

module.exports = { bookTicket, cancelBooking, getUserBookings };