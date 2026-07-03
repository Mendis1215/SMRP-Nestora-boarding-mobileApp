const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  boardingName: { type: String, required: true, trim: true },
  // Owner of the boarding (so owner can filter only their rooms' reviews)
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true, trim: true },
  // Category ratings
  categories: {
    cleanliness: { type: Number, default: 0 },
    location: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
    management: { type: Number, default: 0 },
    facilities: { type: Number, default: 0 },
  },
  photos: [{ type: String }], // URLs of uploaded photos
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
