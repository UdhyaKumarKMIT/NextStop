const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

console.log('🚀 NextStop AI Chatbot - OpenAI Integration');

// Initialize OpenAI
let openai;
let openaiAvailable = false;

try {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
  } else if (apiKey.startsWith('sk-')) {
    console.log('✅ OpenAI API Key found');
    openai = new OpenAI({
      apiKey: apiKey,
    });
    openaiAvailable = true;
    console.log('✅ OpenAI initialized successfully');
  } else {
    console.error('❌ Invalid OpenAI API key format - should start with "sk-"');
  }
} catch (error) {
  console.error('❌ Failed to initialize OpenAI:', error);
}

// Enhanced fallback responses (as backup)
const getFallbackResponse = (userMessage) => {
  if (!userMessage) {
    return "Hello! I'm NextStop AI, your friendly bus booking assistant! 🚌\n\nHow can I help you today?";
  }
  
  const message = userMessage.toLowerCase().trim();
  
  if (message.includes('bus') && (message.includes('type') || message.includes('kind'))) {
    return "🚌 We have AC Sleeper (₹1200-₹2500), AC Seater (₹800-₹1800), and Non-AC Seater (₹400-₹1000) buses with GPS tracking and experienced drivers.";
  }
  
  if ((message.includes('route') || message.includes('destination')) && !message.includes('book')) {
    return "📍 Popular routes: Chennai→Bangalore (6hrs), Mumbai→Pune (3hrs), Delhi→Jaipur (5hrs), Hyderabad→Bangalore (10hrs). Tell me your specific route!";
  }
  
  if (message.includes('book') || message.includes('ticket')) {
    return "🎫 Book tickets in 3 steps: 1) Select route & date 2) Choose bus & seats 3) Pay via UPI/Card/Net Banking. Instant e-ticket delivery!";
  }
  
  if (message.includes('price') || message.includes('cost')) {
    return "💰 AC Sleeper: ₹1200-₹2500, AC Seater: ₹800-₹1800, Non-AC: ₹400-₹1000. Student & senior discounts available!";
  }
  
  if (message.includes('cancel') || message.includes('refund')) {
    return "📋 Cancel 24+ hours before for 95% refund. Refunds processed in 3-7 business days.";
  }
  
  return "I can help with bus bookings, routes, pricing, and travel information. What would you like to know?";
};

// POST /api/chatbot/chat with OpenAI
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    console.log('📨 Received message:', message);
    
    // Validate request
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        response: "Please provide a message"
      });
    }

    // If OpenAI is available, use it
    if (openaiAvailable && openai) {
      console.log('🚀 Using OpenAI API...');
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are NextStop AI, a helpful assistant for a bus booking platform. Provide friendly, accurate information about:
- Bus services, routes, schedules, bookings, and travel
- Ticket pricing, discounts, and offers
- Cancellation policies and refund procedures
- Luggage allowances and amenities
- Customer support information

Keep responses concise (under 150 words), helpful, and focused on bus travel in India. Use emojis occasionally to make it friendly. Be specific about routes, pricing, and procedures.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;
      
      console.log('✅ OpenAI response received');
      
      return res.json({ 
        success: true, 
        response: response,
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        timestamp: new Date().toISOString()
      });
    } else {
      // Use fallback if OpenAI is not available
      console.log('🔄 Using enhanced fallback response');
      const response = getFallbackResponse(message);
      
      return res.json({ 
        success: true, 
        response: response,
        provider: 'fallback',
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('❌ Chat error:', error);
    
    // Use fallback response in case of error
    const fallbackResponse = getFallbackResponse(req.body?.message);
    
    res.json({ 
      success: true, 
      response: fallbackResponse,
      provider: 'fallback-error',
      timestamp: new Date().toISOString()
    });
  }
});

// Test route to check OpenAI status
router.get('/test', async (req, res) => {
  try {
    if (openaiAvailable) {
      // Test OpenAI with a simple request
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Say 'Hello' in one word"
          }
        ],
        max_tokens: 10,
      });

      res.json({ 
        success: true, 
        message: 'OpenAI API is working!',
        openaiAvailable: true,
        testResponse: completion.choices[0].message.content,
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({ 
        success: true, 
        message: 'Enhanced fallback system is active',
        openaiAvailable: false,
        status: 'Using intelligent fallback responses',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.json({ 
      success: false, 
      message: 'OpenAI test failed',
      error: error.message,
      openaiAvailable: false,
      timestamp: new Date().toISOString()
    });
  }
});

// Status route
router.get('/status', (req, res) => {
  res.json({ 
    success: true,
    service: 'NextStop AI Chatbot',
    status: openaiAvailable ? 'OpenAI Operational ✅' : 'Enhanced Fallback Active ✅',
    provider: openaiAvailable ? 'OpenAI GPT-3.5 Turbo' : 'Intelligent Fallback System',
    features: [
      'Bus route information',
      'Ticket booking guidance',
      'Pricing and discounts',
      'Schedule details',
      'Cancellation policies'
    ],
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;