// controllers/bookingController.js
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");

// Book a ticket
const bookTicket = async (req, res) => {
  try {
    const { busId, seats } = req.body;
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    if (bus.availableSeats < seats)
      return res.status(400).json({ message: "Not enough seats available" });

    const totalFare = bus.fare * seats;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      bus: bus._id,
      seatsBooked: seats,
      totalFare,
    });

    // Update bus available seats
    bus.availableSeats -= seats;
    await bus.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to cancel this booking" });

    const bus = await Bus.findById(booking.bus);
    bus.availableSeats += booking.seatsBooked;
    await bus.save();

    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all bookings of a user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("bus");
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { bookTicket, cancelBooking, getUserBookings };
