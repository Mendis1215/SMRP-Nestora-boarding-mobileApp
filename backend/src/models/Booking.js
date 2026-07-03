const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  boardingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Boarding', required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected', 'cancelled'], default: 'pending' },
  moveInDate: { type: Date },
  note: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
