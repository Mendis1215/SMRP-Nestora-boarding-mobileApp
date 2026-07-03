const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  // For student notifications: userId is the recipient
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // For owner-sent notifications: senderId is the owner
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  type: { type: String, enum: ['Booking', 'Payment', 'Announcement', 'Maintenance', 'General', 'system'], default: 'General' },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  recipients: { type: String, default: 'All Registered Students' },
  read: { type: Boolean, default: false },
  isSystem: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
