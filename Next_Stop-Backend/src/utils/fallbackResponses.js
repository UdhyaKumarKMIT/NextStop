// Fallback response function for when Gemini API is unavailable
function getFallbackResponse(userMessage) {
  if (!userMessage) {
    return "Hello! I'm your NextStop AI assistant. I can help you with bus bookings, routes, schedules, pricing, and any travel-related questions. How can I assist you today?";
  }
  
  const message = userMessage.toLowerCase();
  
  if (message.includes('bus') || message.includes('vehicle')) {
    return "We have various buses including AC, Non-AC, and Sleeper coaches. AC buses typically cost ₹800-₹1500, while Non-AC buses range from ₹500-₹1000. Sleeper buses are available for overnight journeys.";
  }
  
  if (message.includes('route') || message.includes('destination')) {
    return "Popular routes include:\n• Chennai to Bangalore (350 km, 6 hours)\n• Mumbai to Pune (150 km, 3 hours)\n• Delhi to Jaipur (280 km, 5 hours)\n• Hyderabad to Bangalore (570 km, 10 hours)";
  }
  
  if (message.includes('book') || message.includes('ticket') || message.includes('reservation')) {
    return "You can book tickets through our website or mobile app. Simply select your route, choose a bus, pick seats, and make payment. We accept credit cards, debit cards, UPI, and net banking.";
  }
  
  if (message.includes('price') || message.includes('cost') || message.includes('fare')) {
    return "Ticket prices vary by bus type:\n• AC buses: ₹800-₹1500\n• Non-AC buses: ₹500-₹1000\n• Sleeper buses: ₹1000-₹2000\nStudent and group discounts available!";
  }
  
  if (message.includes('time') || message.includes('schedule') || message.includes('departure')) {
    return "Buses run frequently on most routes. Popular routes have departures every 1-2 hours from 6:00 AM to 10:00 PM. Overnight buses are available for longer routes.";
  }
  
  if (message.includes('cancel') || message.includes('refund')) {
    return "You can cancel tickets up to 4 hours before departure for a full refund. Cancellations within 4 hours may have a small cancellation fee. Refunds are processed within 5-7 business days.";
  }
  
  return "I can help you with bus bookings, routes, schedules, and pricing information. What specific information are you looking for today?";
}

module.exports = {
  getFallbackResponse
};