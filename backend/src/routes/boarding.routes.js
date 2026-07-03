const express = require('express');
const router = express.Router();
const { getBoardings, getMyBoardings, getBoardingById, createBoarding, updateBoarding, deleteBoarding } = require('../controllers/boarding.controller');
const { protect, requireRole } = require('../middleware/auth.middleware');

router.get('/', getBoardings);                                      // Public
router.get('/mine', protect, requireRole('owner'), getMyBoardings); // Owner only
router.get('/:id', getBoardingById);                                // Public
router.post('/', protect, requireRole('owner'), createBoarding);
router.put('/:id', protect, requireRole('owner'), updateBoarding);
router.delete('/:id', protect, requireRole('owner'), deleteBoarding);

module.exports = router;
