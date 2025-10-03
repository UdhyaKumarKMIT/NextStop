import React from "react";
import { Link} from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="font-sans bg-red-50 text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center h-screen bg-gradient-to-r from-red-600 to-red-500 text-white px-6">
        <h1 className="text-5xl font-bold mb-4">Welcome to Next_Stop</h1>
        <p className="text-lg mb-6 max-w-2xl">
          Your trusted partner for hassle-free and affordable bus booking.
          Travel with comfort and confidence.
        </p>
        <Link
          to="/login"
          className="px-8 py-3 bg-white text-red-600 font-semibold rounded-lg shadow-md hover:bg-red-100 transition"
        >
          Book Now
        </Link>
      </section>

      {/* Services */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-10">
          Our Services
        </h2>
        <div className="flex justify-center">
          <div className="max-w-md text-center">
            <div className="p-6 border border-red-200 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3 text-red-500">
                Bus Booking
              </h3>
              <p>
                Easily book buses across cities with real-time seat availability
                and secure payment options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-red-50">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-10">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="font-semibold text-red-500">How do I book a bus?</h3>
            <p className="text-gray-600">
              Simply click “Book Now” and log in to choose your destination,
              seats, and payment options.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-red-500">
              Can I cancel my booking?
            </h3>
            <p className="text-gray-600">
              Yes, bookings can be cancelled up to 24 hours before departure
              with minimal charges.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-red-500">
              Do you offer loyalty points?
            </h3>
            <p className="text-gray-600">
              Absolutely! Earn rewards with every booking and redeem them on
              your future rides.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-10">
          What Our Customers Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Anita Sharma",
              review:
                "Booking was seamless and the bus was super comfortable. Highly recommend!",
            },
            {
              name: "Ravi Kumar",
              review:
                "Affordable and reliable service. My go-to app for bus booking.",
            },
            {
              name: "Priya Nair",
              review:
                "Loved the easy interface. Booking tickets has never been this simple!",
            },
          ].map((customer, i) => (
            <div
              key={i}
              className="p-6 border border-red-200 rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="italic text-gray-700 mb-4">
                “{customer.review}”
              </p>
              <h4 className="font-semibold text-red-500">{customer.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6 bg-red-50 text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-6">Contact Us</h2>
        <p className="mb-4">
          Have questions? Reach out to us at{" "}
          <a
            href="mailto:support@nextstop.com"
            className="text-red-500 underline"
          >
            support@nextstop.com
          </a>
        </p>
        <p>📍 Chennai, India</p>
      </section>

      {/* Footer */}
      <footer className="bg-red-600 text-white py-6 text-center">
        <p>© {new Date().getFullYear()} Next_Stop. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
