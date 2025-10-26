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
    
    const username = req.user.username; // from JWT middleware

    // Validate required fields
    if (!busNumber || !routeId || !seatNumbers || !journeyDate || !boardingPoint || !passengerDetails) {
      return res.status(400).json({ 
        message: "Missing required booking details" 
      });
    }

    // Normalize seat numbers for format like "1-1", "1-2"
    let selectedSeats = [];
    if (typeof seatNumbers === "string") {
      // Handle both comma-separated and array-like strings
      if (seatNumbers.includes(",")) {
        selectedSeats = seatNumbers.split(",").map(s => s.trim());
      } else if (seatNumbers.startsWith("[") && seatNumbers.endsWith("]")) {
        // Handle array string like "[1-1,1-2]"
        const cleanString = seatNumbers.replace(/[\[\]]/g, '');
        selectedSeats = cleanString.split(",").map(s => s.trim().replace(/"/g, ''));
      } else {
        // Single seat
        selectedSeats = [seatNumbers.trim()];
      }
    } else if (Array.isArray(seatNumbers)) {
      selectedSeats = seatNumbers.map(s => s.toString().trim());
    } else {
      return res.status(400).json({ message: "Invalid seatNumbers format" });
    }

    console.log("Processed seats:", selectedSeats);
    console.log("Passenger details:", passengerDetails);

    // Validate passenger details match selected seats
    if (passengerDetails.length !== selectedSeats.length) {
      return res.status(400).json({ 
        message: "Passenger details count must match selected seats count" 
      });
    }

    // Fetch bus and route
    const bus = await Bus.findOne({ busNumber });
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const route = await Route.findOne({ routeId });
    if (!route) return res.status(404).json({ message: "Route not found" });

    // Get seat data for that date
    const seatData = await Seat.findOne({ busNumber, date: journeyDate });
    if (!seatData) {
      return res.status(404).json({ 
        message: "Seat data not found for this date. Please check bus schedule." 
      });
    }

    // Check seat availability
    const unavailableSeats = selectedSeats.filter(s => !seatData.seats.includes(s));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        message: `Seats ${unavailableSeats.join(", ")} are not available` 
      });
    }

    // Update seat availability - remove booked seats
    seatData.seats = seatData.seats.filter(s => !selectedSeats.includes(s));
    seatData.availableSeats -= selectedSeats.length;
    
    // Add booked seats to bookedSeats array for tracking
    if (!seatData.bookedSeats) {
      seatData.bookedSeats = [];
    }
    seatData.bookedSeats.push(...selectedSeats.map(seat => ({
      seatNumber: seat,
      bookingId: null // Will be updated after booking creation
    })));
    
    await seatData.save();

    // Create booking with passenger details
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

    console.log("Final booking object:", newBooking);
    
    const savedBooking = await newBooking.save();
    console.log("Booking saved successfully with ID:", savedBooking._id);

    // Update seat data with booking reference
    seatData.bookedSeats = seatData.bookedSeats.map(bookedSeat => {
      if (selectedSeats.includes(bookedSeat.seatNumber)) {
        return {
          ...bookedSeat,
          bookingId: savedBooking._id,
          passengerName: passengerDetails.find(p => p.seatNumber === bookedSeat.seatNumber)?.name
        };
      }
      return bookedSeat;
    });
    
    await seatData.save();

    res.status(201).json({
      message: "Booking successful",
      booking: savedBooking,
    });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- CANCEL BOOKING ----------------
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.username !== req.user.username)
      return res.status(403).json({ message: "Not authorized to cancel this booking" });

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

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    console.error("Cancel Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- GET USER BOOKINGS ----------------
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ username: req.user.username })
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    console.error("Get Bookings Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { bookTicket, cancelBooking, getUserBookings };