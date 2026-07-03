const mongoose = require('mongoose');

const BoardingSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  capacity: { type: Number, default: 1 },
  availableRooms: { type: Number, default: 1 },
  amenities: [{ type: String }],
  description: { type: String, trim: true },
  images: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Boarding', BoardingSchema);
