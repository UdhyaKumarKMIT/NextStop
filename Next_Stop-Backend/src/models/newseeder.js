const mongoose = require('mongoose');
const Booking = require('./Booking');
const Bus = require('./Bus');
const Route = require('./Route');
const Seat = require('./Seat');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/NextStop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Tamil Nadu routes data
const routesData = [
  {
    routeId: "route1",
    source: "Chennai",
    destination: "Coimbatore",
    distance: 500,
    duration: "8 hours"
  },
  {
    routeId: "route2", 
    source: "Chennai",
    destination: "Madurai",
    distance: 450,
    duration: "7 hours"
  },
  {
    routeId: "route3",
    source: "Chennai",
    destination: "Trichy",
    distance: 320,
    duration: "5 hours"
  },
  {
    routeId: "route4",
    source: "Coimbatore",
    destination: "Madurai",
    distance: 230,
    duration: "4 hours"
  },
  {
    routeId: "route5",
    source: "Madurai",
    destination: "Kanyakumari",
    distance: 250,
    duration: "5 hours"
  }
];

// Bus data
const busesData = [
  {
    busNumber: "TN01AB1234",
    busName: "Orange Travels",
    type: "AC",
    routeId: "route1",
    operatorName1: "Rajesh Kumar",
    operatorPhone1: "9876543210",
    operatorName2: "Suresh Babu",
    operatorPhone2: "9876543211"
  },
  {
    busNumber: "TN02CD5678",
    busName: "Parveen Travels",
    type: "Sleeper",
    routeId: "route1",
    operatorName1: "Mohan Das",
    operatorPhone1: "9876543212",
    operatorName2: "Karthik Raj",
    operatorPhone2: "9876543213"
  },
  {
    busNumber: "TN03EF9012",
    busName: "KPN Travels",
    type: "Non-AC",
    routeId: "route2",
    operatorName1: "Arun Prakash",
    operatorPhone1: "9876543214",
    operatorName2: "Vijay Kumar",
    operatorPhone2: "9876543215"
  },
  {
    busNumber: "TN04GH3456",
    busName: "SRM Travels",
    type: "AC",
    routeId: "route3",
    operatorName1: "Prakash Raj",
    operatorPhone1: "9876543216",
    operatorName2: "Senthil Kumar",
    operatorPhone2: "9876543217"
  },
  {
    busNumber: "TN05IJ7890",
    busName: "JBT Travels",
    type: "Sleeper",
    routeId: "route4",
    operatorName1: "Gopal Krishnan",
    operatorPhone1: "9876543218",
    operatorName2: "Murali Krishnan",
    operatorPhone2: "9876543219"
  }
];

// Generate all 40 seat numbers
const generateAllSeats = () => {
  const allSeats = [];
  for (let row = 1; row <= 10; row++) {
    for (let col = 1; col <= 4; col++) {
      allSeats.push(`${row}-${col}`);
    }
  }
  return allSeats;
};

// Generate seat data for each bus and date with exactly 40 seats
// Generate seat data for each bus and date with exactly 40 seats
const generateSeatData = (busNumber, date) => {
  const allSeats = generateAllSeats();
  
  // Randomly book some seats (5-15 seats)
  const bookedSeatsCount = Math.floor(Math.random() * 11) + 5;
  const availableSeatsCount = 40 - bookedSeatsCount;
  
  const shuffledSeats = [...allSeats].sort(() => 0.5 - Math.random());
  const bookedSeats = shuffledSeats.slice(0, bookedSeatsCount);
  const availableSeats = shuffledSeats.slice(bookedSeatsCount);
  
  const bookedSeatDetails = bookedSeats.map(seat => ({
    seatNumber: seat,
    passengerName: `Passenger_${seat.replace('-', '_')}`,
    bookingId: new mongoose.Types.ObjectId()
  }));

  // Different prices based on bus type
  const bus = busesData.find(b => b.busNumber === busNumber);
  let price = 500; // base price
  if (bus.type === "AC") price = 800;
  if (bus.type === "Sleeper") price = 1000;

  return {
    busNumber,
    date: new Date(date),
    seats: availableSeats, // ONLY available seats
    bookedSeats: bookedSeatDetails, // ONLY booked seats
    availableSeats: availableSeatsCount, // Count of available seats
    totalSeats: 40, // Total seats in the bus
    price
  };
};
// Booking data
const bookingsData = [
  {
    username: "kumar_raj",
    busNumber: "TN01AB1234",
    routeId: "route1",
    totalSeats: 2,
    seatNumbers: ["1-1", "1-2"],
    passengerDetails: [
      {
        seatNumber: "1-1",
        name: "Kumar Raj",
        age: 35,
        gender: "Male",
        phone: "9876543201"
      },
      {
        seatNumber: "1-2",
        name: "Priya Kumar",
        age: 32,
        gender: "Female", 
        phone: "9876543202"
      }
    ],
    totalFare: 1600,
    journeyDate: new Date("2024-02-15"),
    boardingPoint: "Chennai Koyambedu",
    bookingStatus: "Confirmed"
  },
  {
    username: "sundar_m",
    busNumber: "TN02CD5678", 
    routeId: "route1",
    totalSeats: 1,
    seatNumbers: ["2-1"],
    passengerDetails: [
      {
        seatNumber: "2-1",
        name: "Sundar Moorthy",
        age: 28,
        gender: "Male",
        phone: "9876543203"
      }
    ],
    totalFare: 1000,
    journeyDate: new Date("2024-02-16"),
    boardingPoint: "Chennai Central",
    bookingStatus: "Confirmed"
  },
  {
    username: "meena_sharma",
    busNumber: "TN03EF9012",
    routeId: "route2",
    totalSeats: 3,
    seatNumbers: ["3-1", "3-2", "3-3"],
    passengerDetails: [
      {
        seatNumber: "3-1",
        name: "Meena Sharma",
        age: 45,
        gender: "Female",
        phone: "9876543204"
      },
      {
        seatNumber: "3-2", 
        name: "Rahul Sharma",
        age: 48,
        gender: "Male",
        phone: "9876543205"
      },
      {
        seatNumber: "3-3",
        name: "Anjali Sharma", 
        age: 20,
        gender: "Female",
        phone: "9876543206"
      }
    ],
    totalFare: 1500,
    journeyDate: new Date("2024-02-17"),
    boardingPoint: "Chennai T Nagar",
    bookingStatus: "Pending"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Route.deleteMany({});
    await Bus.deleteMany({});
    await Seat.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Insert routes
    console.log('Inserting routes...');
    const routes = [];
    for (const routeData of routesData) {
      try {
        const route = new Route(routeData);
        await route.save();
        routes.push(route);
        console.log(`Inserted route: ${routeData.routeId}`);
      } catch (error) {
        console.error(`Error inserting route ${routeData.routeId}:`, error.message);
      }
    }
    console.log(`Inserted ${routes.length} routes`);

    // Insert buses
    console.log('Inserting buses...');
    const buses = [];
    for (const busData of busesData) {
      try {
        const bus = new Bus(busData);
        await bus.save();
        buses.push(bus);
        console.log(`Inserted bus: ${busData.busNumber}`);
      } catch (error) {
        console.error(`Error inserting bus ${busData.busNumber}:`, error.message);
      }
    }
    console.log(`Inserted ${buses.length} buses`);

    // Generate and insert seat data
    console.log('Generating seat data...');
    const seatData = [];
    const dates = [];
    
    // Generate dates for next 7 days
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    // Generate seat data for each bus and date combination
    console.log(`Generating seat data for ${busesData.length} buses and ${dates.length} dates...`);
    for (const bus of busesData) {
      for (const date of dates) {
        const seatInfo = generateSeatData(bus.busNumber, date);
        seatData.push(seatInfo);
        console.log(`Generated seats for ${bus.busNumber} on ${date}: ${seatInfo.availableSeats} available, ${seatInfo.bookedSeats.length} booked`);
      }
    }

    // Insert seats
    const seats = [];
    for (const seat of seatData) {
      try {
        const seatDoc = new Seat(seat);
        await seatDoc.save();
        seats.push(seatDoc);
      } catch (error) {
        console.error(`Error inserting seat for bus ${seat.busNumber}:`, error.message);
      }
    }
    console.log(`Inserted ${seats.length} seat records`);

    // Verify seat data was saved correctly
    console.log('\nVerifying seat data...');
    const savedSeats = await Seat.find({});
    console.log(`Total seat documents in DB: ${savedSeats.length}`);
    
    if (savedSeats.length > 0) {
      const sampleSeat = savedSeats[0];
      console.log(`Sample seat record:`, {
        busNumber: sampleSeat.busNumber,
        date: sampleSeat.date,
        totalSeats: sampleSeat.totalSeats,
        availableSeats: sampleSeat.availableSeats,
        bookedSeatsCount: sampleSeat.bookedSeats.length,
        price: sampleSeat.price
      });
    }

    // Insert bookings
    console.log('Inserting bookings...');
    const bookings = [];
    for (const bookingData of bookingsData) {
      try {
        const booking = new Booking(bookingData);
        await booking.save();
        bookings.push(booking);
        console.log(`Inserted booking for: ${bookingData.username}`);
      } catch (error) {
        console.error(`Error inserting booking for ${bookingData.username}:`, error.message);
      }
    }
    console.log(`Inserted ${bookings.length} bookings`);

    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY ===');
    console.log(`Routes: ${routes.length}`);
    console.log(`Buses: ${buses.length}`);
    console.log(`Seat Records: ${seats.length}`);
    console.log(`Bookings: ${bookings.length}`);
    
    // Final verification
    console.log('\n=== FINAL VERIFICATION ===');
    const dbBuses = await Bus.find({});
    console.log('Buses in database:');
    dbBuses.forEach(bus => {
      console.log(`- ${bus.busNumber}: ${bus.busName} (${bus.type})`);
    });

    const dbSeats = await Seat.find({});
    console.log(`\nSeat records in database: ${dbSeats.length}`);
    
    // Check a few seat records
    const sampleSeats = await Seat.find({}).limit(3);
    sampleSeats.forEach((seat, index) => {
      console.log(`\nSeat Record ${index + 1}:`);
      console.log(`- Bus: ${seat.busNumber}`);
      console.log(`- Date: ${seat.date}`);
      console.log(`- Total Seats: ${seat.totalSeats}`);
      console.log(`- Available Seats: ${seat.availableSeats}`);
      console.log(`- Booked Seats: ${seat.bookedSeats.length}`);
      console.log(`- Price: ₹${seat.price}`);
    });
    
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, connectDB };