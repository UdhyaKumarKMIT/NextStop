const cron = require('node-cron');
const Booking = require('../models/Booking');
const { sendJourneyReminder } = require('./emailservice'); // Updated import

class NotificationScheduler {
  constructor() {
    this.isRunning = false;
    this.sentReminders = new Set();
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ Notification scheduler is already running');
      return;
    }

    // Run every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      try {
        console.log('🕒 Running notification check at:', new Date().toLocaleString());
        await this.checkAndSendReminders();
      } catch (error) {
        console.error('Error in notification scheduler:', error);
      }
    });

    this.isRunning = true;
    console.log('✅ Notification scheduler started (runs every 15 minutes)');
  }

  async checkAndSendReminders() {
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));

    try {
      // Find confirmed bookings where journey date is within the next 2 hours
      const bookingsToRemind = await Booking.find({
        bookingStatus: 'Confirmed',
        journeyDate: {
          $gte: now,
          $lte: twoHoursFromNow
        }
      });

      console.log(`📧 Found ${bookingsToRemind.length} bookings within 2 hours`);

      // Send reminders for each booking
      for (const booking of bookingsToRemind) {
        try {
          // Check if we already sent reminder for this booking
          const bookingKey = `${booking._id}_${booking.journeyDate.getTime()}`;
          
          if (this.sentReminders.has(bookingKey)) {
            console.log(`⏩ Skipping already sent reminder for booking: ${booking._id}`);
            continue;
          }

          await sendJourneyReminder(booking);
          
          // Mark as sent to avoid duplicates
          this.sentReminders.add(bookingKey);
          console.log(`✅ Reminder sent for booking: ${booking._id}`);
          
        } catch (error) {
          console.error(`❌ Failed to send reminder for booking ${booking._id}:`, error.message);
        }
      }

      // Clean up old entries from sentReminders
      this.cleanupSentReminders();

    } catch (error) {
      console.error('Error checking for reminders:', error);
    }
  }

  cleanupSentReminders() {
    const now = new Date().getTime();
    const twoHoursAgo = now - (2 * 60 * 60 * 1000);
    
    // Remove entries older than 2 hours
    for (const key of this.sentReminders) {
      const [, timestamp] = key.split('_');
      if (parseInt(timestamp) < twoHoursAgo) {
        this.sentReminders.delete(key);
      }
    }
  }

  // Manual trigger for testing
  async sendTestReminder(bookingId) {
    try {
      console.log('🔍 Looking for booking:', bookingId);
      
      // Find booking by ID
      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      console.log('📋 Booking found:', {
        id: booking._id,
        username: booking.username,
        passengerCount: booking.passengerDetails.length
      });
      
      await sendJourneyReminder(booking);
      console.log('✅ Test reminder sent successfully');
    } catch (error) {
      console.error('❌ Test reminder failed:', error.message);
      throw error;
    }
  }

  // Method to manually clear sent reminders (for testing)
  clearSentReminders() {
    this.sentReminders.clear();
    console.log('🧹 Cleared all sent reminders');
  }
}

module.exports = new NotificationScheduler();