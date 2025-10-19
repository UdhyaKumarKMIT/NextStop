const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const Seat = require("../models/Seat");

// ---------------- BOOK A TICKET ----------------
const bookTicket = async (req, res) => {
  try {
    const { busNumber, routeId, seatNumbers, journeyDate, boardingPoint } = req.body;
    const username = req.user.username; // user authenticated via JWT

    // Validate input
    if (!busNumber || !routeId || !seatNumbers || !journeyDate) {
      return res.status(400).json({ message: "Missing required booking details" });
    }

    // Fetch bus and route details
    const bus = await Bus.findOne({ busNumber });
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const route = await Route.findOne({ routeId });
    if (!route) return res.status(404).json({ message: "Route not found" });

    // Find seat info for the bus & date
    const seatData = await Seat.findOne({ busNumber, date: journeyDate });
    if (!seatData) return res.status(404).json({ message: "Seat data not found for this date" });

    // Check seat availability
    const unavailableSeats = seatNumbers.filter(s => !seatData.seats.includes(s));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ message: `Seats ${unavailableSeats.join(", ")} are not available` });
    }

    // Update seat availability
    seatData.seats = seatData.seats.filter(s => !seatNumbers.includes(s));
    seatData.availableSeats -= seatNumbers.length;
    await seatData.save();

    // Calculate total fare
    const totalFare = seatData.price * seatNumbers.length;

    // Create booking
    const newBooking = new Booking({
      userId: username,
      busId: busNumber,
      routeId,
      totalSeats: seatNumbers.length,
      seatNumbers: seatNumbers.join(","),
      totalFare,
      journeyDate,
      boardingPoint,
      bookingStatus: "Confirmed",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking successful",
      booking: newBooking
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

    if (booking.userId !== req.user.username)
      return res.status(403).json({ message: "Not authorized to cancel this booking" });

    const seatData = await Seat.findOne({ busNumber: booking.busId, date: booking.journeyDate });
    if (seatData) {
      // Restore seats
      const cancelledSeats = booking.seatNumbers.split(",");
      seatData.seats.push(...cancelledSeats);
      seatData.availableSeats += cancelledSeats.length;
      await seatData.save();
    }

    booking.bookingStatus = "Cancelled";
    booking.updatedAt = new Date();
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
    const bookings = await Booking.find({ userId: req.user.username });
    res.json({ bookings });
  } catch (err) {
    console.error("Get Bookings Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { bookTicket, cancelBooking, getUserBookings };
