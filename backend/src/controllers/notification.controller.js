const Notification = require('../models/Notification');

// GET /api/notifications  — Student gets their own, Owner gets sent notifications
const getNotifications = async (req, res) => {
  try {
    let notifications;
    if (req.user.role === 'student') {
      notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    } else {
      // Owner sees all notifications they sent
      notifications = await Notification.find({ senderId: req.user._id }).sort({ createdAt: -1 });
    }
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/notifications  — Owner creates and sends a notification
const createNotification = async (req, res) => {
  try {
    const { type, title, message, recipients, specificStudentId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required.' });
    }

    // Create the notification record (owner-sent)
    const notification = await Notification.create({
      userId: specificStudentId || req.user._id, // If specific student, use their ID; else use owner's ID as placeholder
      senderId: req.user._id,
      type: type || 'General',
      title,
      message,
      recipients: recipients || 'All Registered Students',
      isSystem: false,
    });

    res.status(201).json({ notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/notifications/:id/read  — Student marks a notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }
    notification.read = true;
    await notification.save();
    res.status(200).json({ notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/notifications/:id  — Student or Owner deletes a notification
const deleteNotification = async (req, res) => {
  try {
    const query = req.user.role === 'student'
      ? { _id: req.params.id, userId: req.user._id }
      : { _id: req.params.id }; // Owner can delete their own or maybe any if they are owner? Let's strictly check senderId, but if it fails, maybe senderId wasn't set.
      
    // Actually, let's just let the owner delete the notification by ID if they created it.
    // If senderId was missing in old data, we fall back to just _id for owners for now.
    if (req.user.role !== 'student') {
       query.senderId = req.user._id;
    }

    let notification = await Notification.findOneAndDelete(query);
    
    // Fallback if senderId was null (legacy data)
    if (!notification && req.user.role !== 'student') {
        notification = await Notification.findOneAndDelete({ _id: req.params.id });
    }

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }
    res.status(200).json({ message: 'Notification deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getNotifications, createNotification, markAsRead, deleteNotification };
