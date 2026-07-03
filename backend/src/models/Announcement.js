const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['Low', 'Normal', 'High', 'Urgent'], default: 'Normal' },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  author: { type: String, required: true },  // Owner's name (auto-filled)
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
