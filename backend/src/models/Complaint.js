const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Owner of the boarding (so owner can filter their tenants' complaints)
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomNumber: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Maintenance', 'Utilities', 'Security', 'Facilities', 'Management', 'Other'], required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: { type: String, enum: ['Pending', 'Viewed', 'Respond', 'In Progress', 'Resolved', 'Maintenance'], default: 'Pending' },
  photos: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
