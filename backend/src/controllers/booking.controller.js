const Booking = require('../models/Booking');
const Boarding = require('../models/Boarding');
const Notification = require('../models/Notification');

// GET /api/bookings  — Student gets own, Owner gets bookings for their boardings
const getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'student') {
      bookings = await Booking.find({ studentId: req.user._id })
        .populate('boardingId', 'name location price images')
        .sort({ createdAt: -1 });
    } else {
      // Owner finds all their boardings first
      const myBoardings = await Boarding.find({ ownerId: req.user._id }).select('_id');
      const boardingIds = myBoardings.map(b => b._id);
      
      bookings = await Booking.find({ boardingId: { $in: boardingIds } })
        .populate('studentId', 'name email phone')
        .populate('boardingId', 'name location price')
        .sort({ createdAt: -1 });
    }
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/bookings  — Student creates a booking request
const createBooking = async (req, res) => {
  try {
    const { boardingId, moveInDate, note } = req.body;

    if (!boardingId) {
      return res.status(400).json({ error: 'Boarding ID is required.' });
    }

    const boarding = await Boarding.findById(boardingId);
    if (!boarding) return res.status(404).json({ error: 'Boarding not found.' });

    const booking = await Booking.create({
      studentId: req.user._id,
      boardingId,
      status: 'pending',
      moveInDate,
      note,
    });

    // Notify the owner
    await Notification.create({
      userId: boarding.ownerId,
      senderId: req.user._id,
      type: 'Booking',
      title: 'New Booking Request',
      message: `${req.user.name} has requested to book ${boarding.name}.`,
      isSystem: true,
    });

    res.status(201).json({ booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/bookings/:id/status  — Owner updates booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const booking = await Booking.findById(req.params.id).populate('boardingId', 'ownerId name');
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    // Check if owner owns this boarding
    if (booking.boardingId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    booking.status = status;
    await booking.save();

    // Notify the student
    await Notification.create({
      userId: booking.studentId,
      senderId: req.user._id,
      type: 'Booking',
      title: 'Booking Update',
      message: `Your booking for ${booking.boardingId.name} is now ${status}.`,
      isSystem: true,
    });

    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/bookings/:id  — Student cancels booking request
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, studentId: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found or unauthorized' });
    res.status(200).json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBookings, createBooking, updateBookingStatus, deleteBooking };
