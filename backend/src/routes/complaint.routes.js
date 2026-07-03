const express = require('express');
const router = express.Router();
const { getComplaints, createComplaint, updateComplaint, deleteComplaint, updateComplaintStatus } = require('../controllers/complaint.controller');
const { protect, requireRole } = require('../middleware/auth.middleware');

router.get('/', protect, getComplaints);
router.post('/', protect, requireRole('student'), createComplaint);
router.put('/:id', protect, requireRole('student'), updateComplaint);
router.delete('/:id', protect, requireRole('student'), deleteComplaint);
router.patch('/:id/status', protect, requireRole('owner'), updateComplaintStatus);

module.exports = router;
