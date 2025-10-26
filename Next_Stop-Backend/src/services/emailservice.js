const nodemailer = require('nodemailer');
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const User = require('../models/User');

// Create transporter with your Gmail credentials
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // studycegmit@gmail.com
      pass: process.env.EMAIL_PASS  // zeft dmkc knyn jwby
    }
  });
};

// Email template function
const createReminderEmailTemplate = (userName, booking, bus, route) => {
  const journeyDate = new Date(booking.journeyDate);
  const formattedDate = journeyDate.toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const formattedTime = journeyDate.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  const passengerList = booking.passengerDetails.map(p => 
    `${p.name} (Seat: ${p.seatNumber})`
  ).join(", ");

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { 
                font-family: 'Arial', sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background-color: #f4f4f4;
            }
            .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header { 
                background: #dc2626; 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
            }
            .header p {
                margin: 10px 0 0 0;
                font-size: 16px;
                opacity: 0.9;
            }
            .content { 
                padding: 30px; 
            }
            .details { 
                background: #f8fafc; 
                padding: 20px; 
                margin: 15px 0; 
                border-radius: 8px; 
                border-left: 4px solid #dc2626;
            }
            .details h3 {
                color: #dc2626;
                margin-top: 0;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 10px;
            }
            .footer { 
                text-align: center; 
                margin-top: 30px; 
                color: #6b7280; 
                font-size: 14px;
                padding: 20px;
                background: #f8fafc;
                border-top: 1px solid #e5e7eb;
            }
            .reminder { 
                background: #fff3cd; 
                border: 1px solid #ffeaa7; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0; 
                color: #856404;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                margin: 8px 0;
                padding: 5px 0;
            }
            .info-label {
                font-weight: bold;
                color: #374151;
                min-width: 150px;
            }
            .info-value {
                color: #6b7280;
                text-align: right;
                flex: 1;
            }
            .passenger-list {
                background: white;
                padding: 15px;
                border-radius: 5px;
                margin: 10px 0;
            }
            .passenger-item {
                padding: 5px 0;
                border-bottom: 1px solid #e5e7eb;
            }
            .passenger-item:last-child {
                border-bottom: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚌 Journey Reminder</h1>
                <p>Your NextStop bus departs in 2 hours!</p>
            </div>
            
            <div class="content">
                <div class="reminder">
                    <strong>⏰ Important Reminder:</strong> 
                    Your bus journey is scheduled to depart in 2 hours. 
                    Please arrive at the boarding point at least 30 minutes before departure time.
                </div>
                
                <div class="details">
                    <h3>📋 Journey Details</h3>
                    <div class="info-row">
                        <span class="info-label">Bus:</span>
                        <span class="info-value">${bus.busName} (${bus.type}) - ${bus.busNumber}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Route:</span>
                        <span class="info-value">${route.source} → ${route.destination}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Date:</span>
                        <span class="info-value">${formattedDate}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Time:</span>
                        <span class="info-value">${formattedTime}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Seats:</span>
                        <span class="info-value">${booking.seatNumbers.join(", ")}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Boarding Point:</span>
                        <span class="info-value">${booking.boardingPoint}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Total Amount:</span>
                        <span class="info-value">₹${booking.totalFare}</span>
                    </div>
                </div>

                <div class="details">
                    <h3>👥 Passenger Details</h3>
                    <div class="passenger-list">
                        ${booking.passengerDetails.map(passenger => `
                            <div class="passenger-item">
                                <strong>${passenger.name}</strong> - 
                                Seat: ${passenger.seatNumber} | 
                                Age: ${passenger.age} | 
                                Gender: ${passenger.gender}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="details">
                    <h3>📞 Contact Information</h3>
                    <div class="info-row">
                        <span class="info-label">${bus.operatorName1}:</span>
                        <span class="info-value">${bus.operatorPhone1}</span>
                    </div>
                    ${bus.operatorName2 ? `
                    <div class="info-row">
                        <span class="info-label">${bus.operatorName2}:</span>
                        <span class="info-value">${bus.operatorPhone2}</span>
                    </div>
                    ` : ''}
                </div>

                <div class="details">
                    <h3>🔖 Booking Reference</h3>
                    <div class="info-row">
                        <span class="info-label">Booking ID:</span>
                        <span class="info-value">${booking._id.toString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>Thank you for choosing NextStop. Have a safe and pleasant journey! 🛣️</p>
                <p><strong>NextStop Team</strong></p>
                <p>For support, contact us at: studycegmit@gmail.com</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const sendJourneyReminder = async (booking) => {
  try {
    console.log('📨 Preparing to send reminder for booking:', booking._id);

    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured in environment variables');
    }

    // Fetch required data
    const bus = await Bus.findOne({ busNumber: booking.busNumber });
    const route = await Route.findOne({ routeId: booking.routeId });
    const user = await User.findOne({ username: booking.username });

    if (!bus || !route) {
      throw new Error('Bus or route details not found');
    }
    if (!user) {
      throw new Error(`User not found with username: ${booking.username}`);
    }
    if (!user.email) {
      throw new Error(`No email address found for user: ${booking.username}`);
    }

    const transporter = createTransporter();
    const userName = user.firstName || user.username;

    const mailOptions = {
      from: {
        name: 'NextStop Bus Services',
        address: process.env.EMAIL_USER
      },
      to: user.email,
      subject: `🚌 Journey Reminder: ${route.source} to ${route.destination} - ${new Date(booking.journeyDate).toLocaleDateString('en-IN')}`,
      html: createReminderEmailTemplate(userName, booking, bus, route),
      text: `Journey Reminder: Your bus ${bus.busName} (${bus.busNumber}) from ${route.source} to ${route.destination} is scheduled to depart on ${new Date(booking.journeyDate).toLocaleDateString()} at ${new Date(booking.journeyDate).toLocaleTimeString()}. Please arrive at ${booking.boardingPoint} at least 30 minutes before departure.`
    };

    console.log('✉️ Sending email to:', user.email);
    console.log('📋 Booking details:', {
      bookingId: booking._id,
      username: booking.username,
      userEmail: user.email,
      bus: bus.busName,
      route: `${route.source} to ${route.destination}`,
      journeyDate: booking.journeyDate
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    const result = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Journey reminder sent successfully for booking ${booking._id}`);
    console.log('📨 Message ID:', result.messageId);
    console.log('✅ Response:', result.response);

    return result;

  } catch (error) {
    console.error(`❌ Failed to send reminder for booking ${booking._id}:`, error.message);
    
    // More detailed error logging
    if (error.code) {
      console.error('🔧 Error code:', error.code);
    }
    if (error.command) {
      console.error('🔧 SMTP command:', error.command);
    }
    
    throw error;
  }
};

module.exports = { sendJourneyReminder };