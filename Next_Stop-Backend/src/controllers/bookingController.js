// controllers/bookingController.js
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const SeatAvailability = require("../models/SeatAvailability");
const generateSeats = require("../Utils/generateSeats");
// Book a ticket
const bookTicket = async (req, res) => {
  try {
    const { busId, travelDate, selectedSeats } = req.body; // e.g., ["3A", "3B"]
    const userId = req.user._id;

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    // Find seat availability for that date or create one
    let seatData = await SeatAvailability.findOne({ bus: busId, date: travelDate });

    if (!seatData) {
      seatData = await SeatAvailability.create({
        bus: busId,
        date: travelDate,
        seats: generateSeats(),
      });
    }

    // Check seat availability
    for (const seatNo of selectedSeats) {
      const seat = seatData.seats.find((s) => s.seat_no === seatNo);
      if (!seat || seat.is_booked) {
        return res.status(400).json({ message: `Seat ${seatNo} is already booked` });
      }
    }

    // Book seats
    seatData.seats = seatData.seats.map((s) =>
      selectedSeats.includes(s.seat_no) ? { ...s, is_booked: true } : s
    );
    seatData.available_count -= selectedSeats.length;
    await seatData.save();

    // Create booking
    const totalFare = bus.fare_per_seat * selectedSeats.length;

    const booking = await Booking.create({
      user: userId,
      bus: busId,
      route: bus.route_id,
      travel_date: travelDate,
      seats_booked: selectedSeats,
      total_fare: totalFare,
      booking_time: new Date(),
      status: "confirmed",
    });

    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { bookTicket };

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
