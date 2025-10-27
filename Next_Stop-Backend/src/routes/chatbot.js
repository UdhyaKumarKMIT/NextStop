const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

console.log("🚀 NextStop AI Chatbot - Gemini Integration");

// ====== Gemini Setup ======
const GEMINI_API_KEY = "AIzaSyC9ceVkQbouInhJny7CR0XjacKbpZnvYnI";
let genAI;
let geminiAvailable = false;

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY not found");
} else if (GEMINI_API_KEY.startsWith("AIza")) {
  console.log("✅ Gemini API Key found");
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    geminiAvailable = true;
    console.log("✅ Gemini initialized successfully");
  } catch (error) {
    console.error("❌ Gemini initialization failed:", error.message);
  }
} else {
  console.error("❌ Invalid Gemini API key format");
}

// ====== Enhanced fallback ======
const getFallbackResponse = (userMessage) => {
  if (!userMessage) {
    return "Hello! I'm NextStop AI, your friendly bus booking assistant! 🚌\n\nHow can I help you today?";
  }

  const message = userMessage.toLowerCase().trim();

  if (message.includes("bus") && (message.includes("type") || message.includes("kind"))) {
    return "🚌 We have AC Sleeper (₹1200-₹2500), AC Seater (₹800-₹1800), and Non-AC Seater (₹400-₹1000) buses with GPS tracking and experienced drivers.";
  }

  if ((message.includes("route") || message.includes("destination")) && !message.includes("book")) {
    return "📍 Popular routes: Chennai→Bangalore (6hrs), Mumbai→Pune (3hrs), Delhi→Jaipur (5hrs), Hyderabad→Bangalore (10hrs). Tell me your specific route!";
  }

  if (message.includes("book") || message.includes("ticket")) {
    return "🎫 Book tickets in 3 steps: 1) Select route & date 2) Choose bus & seats 3) Pay via UPI/Card/Net Banking. Instant e-ticket delivery!";
  }

  if (message.includes("price") || message.includes("cost")) {
    return "💰 AC Sleeper: ₹1200-₹2500, AC Seater: ₹800-₹1800, Non-AC: ₹400-₹1000. Student & senior discounts available!";
  }

  if (message.includes("cancel") || message.includes("refund")) {
    return "📋 Cancel 24+ hours before for 95% refund. Refunds processed in 3-7 business days.";
  }

  return "I can help with bus bookings, routes, pricing, and travel information. What would you like to know?";
};

// ====== POST /api/chatbot/chat ======
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("📨 Received message:", message);

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        response: "Please provide a message",
      });
    }

    if (geminiAvailable && genAI) {
      console.log("🚀 Using Gemini API (SDK)...");

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const systemPrompt = `You are NextStop AI, a helpful assistant for a bus booking platform. Provide friendly, accurate information about:
- Bus services, routes, schedules, bookings, and travel
- Ticket pricing, discounts, and offers
- Cancellation policies and refund procedures
- Luggage allowances and amenities
- Customer support information

Keep responses concise (under 150 words), helpful, and focused on bus travel in India. Use emojis occasionally to make it friendly. Be specific about routes, pricing, and procedures.`;

      const result = await model.generateContent(`${systemPrompt}\n\nUser: ${message}`);
      const response = result.response.text();

      console.log("✅ Gemini response received");

      return res.json({
        success: true,
        response: response,
        provider: "gemini",
        model: "gemini-2.5-flash",
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log("🔄 Using fallback response");
      const fallbackResponse = getFallbackResponse(message);
      return res.json({
        success: true,
        response: fallbackResponse,
        provider: "fallback",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("❌ Chat error:", error);
    const fallbackResponse = getFallbackResponse(req.body?.message);
    res.json({
      success: true,
      response: fallbackResponse,
      provider: "fallback-error",
      timestamp: new Date().toISOString(),
    });
  }
});

// ====== Test route ======
router.get("/test", async (req, res) => {
  try {
    if (geminiAvailable && genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Say Hello in one word");
      const text = result.response.text();

      res.json({
        success: true,
        message: "Gemini API is working!",
        geminiAvailable: true,
        testResponse: text,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.json({
        success: true,
        message: "Enhanced fallback system is active",
        geminiAvailable: false,
        status: "Using intelligent fallback responses",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "Gemini test failed",
      error: error.message,
      geminiAvailable: false,
      timestamp: new Date().toISOString(),
    });
  }
});

// ====== Status route ======
router.get("/status", (req, res) => {
  res.json({
    success: true,
    service: "NextStop AI Chatbot",
    status: geminiAvailable ? "Gemini Operational ✅" : "Enhanced Fallback Active ✅",
    provider: geminiAvailable ? "Gemini 2.5 Flash" : "Intelligent Fallback System",
    features: [
      "Bus route information",
      "Ticket booking guidance",
      "Pricing and discounts",
      "Schedule details",
      "Cancellation policies",
    ],
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
