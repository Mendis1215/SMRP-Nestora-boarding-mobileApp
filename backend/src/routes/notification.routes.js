const express = require('express');
const router = express.Router();
const { getNotifications, createNotification, markAsRead, deleteNotification } = require('../controllers/notification.controller');
const { protect, requireRole } = require('../middleware/auth.middleware');

router.get('/', protect, getNotifications);
router.post('/', protect, requireRole('owner'), createNotification);
router.patch('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
