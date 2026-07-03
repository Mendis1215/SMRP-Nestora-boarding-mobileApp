const Review = require('../models/Review');

// GET /api/reviews  — Get all reviews (public)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('studentId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/reviews/mine  — Student gets their own reviews
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/reviews/owner  — Owner gets reviews for their rooms only
const getOwnerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ ownerId: req.user._id })
      .populate('studentId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/reviews  — Student creates a review
const createReview = async (req, res) => {
  try {
    const { boardingName, ownerId, rating, text, categories } = req.body;

    if (!boardingName || !ownerId || !rating || !text) {
      return res.status(400).json({ error: 'boardingName, ownerId, rating, and text are required.' });
    }

    const review = await Review.create({
      studentId: req.user._id,
      boardingName,
      ownerId,
      rating,
      text,
      categories: categories || {},
    });

    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/reviews/:id  — Student edits their own review
const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, studentId: req.user._id });
    if (!review) {
      return res.status(404).json({ error: 'Review not found or you do not have permission.' });
    }

    const { rating, text, categories } = req.body;
    if (rating) review.rating = rating;
    if (text) review.text = text;
    if (categories) review.categories = categories;

    await review.save();
    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/reviews/:id  — Student deletes own review, Owner removes any review for their room
const deleteReview = async (req, res) => {
  try {
    const query = req.user.role === 'student'
      ? { _id: req.params.id, studentId: req.user._id }
      : { _id: req.params.id, ownerId: req.user._id };

    const review = await Review.findOneAndDelete(query);
    if (!review) {
      return res.status(404).json({ error: 'Review not found or you do not have permission.' });
    }
    res.status(200).json({ message: 'Review deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllReviews, getMyReviews, getOwnerReviews, createReview, updateReview, deleteReview };
