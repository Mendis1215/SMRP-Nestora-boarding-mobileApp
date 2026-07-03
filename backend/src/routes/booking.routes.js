const express = require('express');
const router = express.Router();
const { getBookings, createBooking, updateBookingStatus, deleteBooking } = require('../controllers/booking.controller');
const { protect, requireRole } = require('../middleware/auth.middleware');

router.get('/', protect, getBookings);                                     // Both student & owner
router.post('/', protect, requireRole('student'), createBooking);          // Student only
router.patch('/:id/status', protect, requireRole('owner'), updateBookingStatus); // Owner only
router.delete('/:id', protect, requireRole('student'), deleteBooking);     // Student only

module.exports = router;
