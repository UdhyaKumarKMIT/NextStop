import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your NextStop AI assistant. I can help you with bus bookings, routes, schedules, pricing, and any travel-related questions. How can I assist you today?",
      sender: "bot"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call backend API instead of direct Gemini
  const getAIResponse = async (userMessage) => {
    try {
      const response = await fetch('http://localhost:5050/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.response;
      } else {
        throw new Error(data.response);
      }
    } catch (error) {
      console.error('API call failed:', error);
      return getFallbackResponse(userMessage);
    }
  };

  // Fallback responses when API is down
  const getFallbackResponse = (userMessage) => {
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
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const botResponse = await getAIResponse(inputMessage);
      setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      const fallbackResponse = getFallbackResponse(inputMessage);
      setMessages(prev => [...prev, { text: fallbackResponse, sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: "🚌 Available buses", prompt: "What types of buses do you have?" },
    { text: "📍 Popular routes", prompt: "What are your most popular bus routes?" },
    { text: "💰 Ticket prices", prompt: "How much do bus tickets cost?" },
    { text: "⏰ Schedules", prompt: "What are the bus schedules?" },
    { text: "🎫 How to book", prompt: "How do I book a bus ticket?" },
    { text: "❓ Cancellation", prompt: "What is your cancellation policy?" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-600">
      {/* Header */}
      <div className="bg-red-600 text-white px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-red-200 transition flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold">NextStop Assistant</h1>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
            <span className="text-xl">🤖</span>
            <span className="text-red-200 text-sm">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-140px)] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-4 overflow-y-auto border border-white/20">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-6 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block max-w-[80%] p-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-red-500 text-white rounded-br-none shadow-lg'
                    : 'bg-white/20 text-white rounded-bl-none backdrop-blur-sm border border-white/30'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{message.text}</div>
              </div>
              <div className={`text-xs mt-1 text-red-200 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {message.sender === 'user' ? 'You' : 'NextStop Assistant'}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="text-left mb-6">
              <div className="inline-block bg-white/20 text-white p-4 rounded-2xl rounded-bl-none backdrop-blur-sm border border-white/30">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <p className="text-red-200 text-sm mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(action.prompt)}
                disabled={isLoading}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition backdrop-blur-sm border border-white/20 disabled:opacity-50 flex items-center space-x-1"
              >
                <span>{action.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about buses, routes, bookings, pricing..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-red-200/70 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold"
          >
            <span>Send</span>
            <span>📤</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;