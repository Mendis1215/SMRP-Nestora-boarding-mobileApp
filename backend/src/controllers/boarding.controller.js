const Boarding = require('../models/Boarding');

// GET /api/boardings  — Public route, get all boardings (with optional location filter)
const getBoardings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }
    const boardings = await Boarding.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ boardings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/boardings/mine  — Owner gets their own boardings
const getMyBoardings = async (req, res) => {
  try {
    const boardings = await Boarding.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ boardings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/boardings/:id  — Get single boarding details
const getBoardingById = async (req, res) => {
  try {
    const boarding = await Boarding.findById(req.params.id).populate('ownerId', 'name email phone');
    if (!boarding) return res.status(404).json({ error: 'Boarding not found' });
    res.status(200).json({ boarding });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/boardings  — Owner creates a new boarding
const createBoarding = async (req, res) => {
  try {
    const { name, location, address, price, capacity, availableRooms, amenities, description, images } = req.body;

    if (!name || !location || !address || !price) {
      return res.status(400).json({ error: 'Name, location, address, and price are required.' });
    }

    const boarding = await Boarding.create({
      ownerId: req.user._id,
      name,
      location,
      address,
      price,
      capacity: capacity || 1,
      availableRooms: availableRooms || 1,
      amenities: amenities || [],
      description: description || '',
      images: images || [],
    });

    res.status(201).json({ boarding });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/boardings/:id  — Owner updates their boarding
const updateBoarding = async (req, res) => {
  try {
    const boarding = await Boarding.findOne({ _id: req.params.id, ownerId: req.user._id });
    if (!boarding) return res.status(404).json({ error: 'Boarding not found or unauthorized' });

    const updated = await Boarding.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ boarding: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/boardings/:id  — Owner deletes their boarding
const deleteBoarding = async (req, res) => {
  try {
    const boarding = await Boarding.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
    if (!boarding) return res.status(404).json({ error: 'Boarding not found or unauthorized' });
    res.status(200).json({ message: 'Boarding deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBoardings, getMyBoardings, getBoardingById, createBoarding, updateBoarding, deleteBoarding };
