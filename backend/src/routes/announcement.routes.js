const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcement.controller');
const { protect, requireRole } = require('../middleware/auth.middleware');

router.get('/', getAnnouncements); // Public - anyone can view
router.post('/', protect, requireRole('owner'), createAnnouncement);
router.put('/:id', protect, requireRole('owner'), updateAnnouncement);
router.delete('/:id', protect, requireRole('owner'), deleteAnnouncement);

module.exports = router;
