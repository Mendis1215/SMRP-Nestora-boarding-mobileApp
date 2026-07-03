const Announcement = require('../models/Announcement');

// GET /api/announcements  — All users can see all announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json({ announcements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/announcements  — Owner creates announcement
const createAnnouncement = async (req, res) => {
  try {
    const { priority, title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    const announcement = await Announcement.create({
      ownerId: req.user._id,
      priority: priority || 'Normal',
      title,
      content,
      author: req.user.name,
    });

    res.status(201).json({ announcement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/announcements/:id  — Owner edits ONLY their own announcement
const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOne({ _id: req.params.id, ownerId: req.user._id });
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found or you do not have permission.' });
    }

    const { priority, title, content } = req.body;
    if (priority) announcement.priority = priority;
    if (title) announcement.title = title;
    if (content) announcement.content = content;

    await announcement.save();
    res.status(200).json({ announcement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/announcements/:id  — Owner can delete any announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found.' });
    }
    res.status(200).json({ message: 'Announcement deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
