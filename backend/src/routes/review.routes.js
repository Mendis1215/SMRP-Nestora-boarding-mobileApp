const express = require('express');
const router = express.Router();
const { getAllReviews, getMyReviews, getOwnerReviews, createReview, updateReview, deleteReview } = require('../controllers/review.controller');
const { protect, requireRole } = require('../middleware/auth.middleware');

router.get('/', getAllReviews);                                     // Public
router.get('/mine', protect, requireRole('student'), getMyReviews);
router.get('/owner', protect, requireRole('owner'), getOwnerReviews);
router.post('/', protect, requireRole('student'), createReview);
router.put('/:id', protect, requireRole('student'), updateReview);
router.delete('/:id', protect, deleteReview);                      // Both student & owner

module.exports = router;
