const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

// GET /api/complaints  — Student gets own, Owner gets their tenants' complaints
const getComplaints = async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'student') {
      complaints = await Complaint.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    } else {
      complaints = await Complaint.find({ ownerId: req.user._id })
        .populate('studentId', 'name email')
        .sort({ createdAt: -1 });
    }
    res.status(200).json({ complaints });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/complaints  — Student creates a complaint
const createComplaint = async (req, res) => {
  try {
    const { ownerId, roomNumber, category, priority, title, description } = req.body;

    if (!ownerId || !roomNumber || !category || !priority || !title || !description) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const complaint = await Complaint.create({
      studentId: req.user._id,
      ownerId,
      roomNumber,
      category,
      priority,
      title,
      description,
      status: 'Pending',
    });

    // Send notification to owner
    await Notification.create({
      userId: ownerId,
      senderId: req.user._id,
      type: 'General',
      title: `New Complaint: ${title}`,
      message: `${req.user.name} submitted a complaint from ${roomNumber}.`,
      isSystem: true,
    });

    res.status(201).json({ complaint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/complaints/:id  — Student edits their own complaint
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id, studentId: req.user._id });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found or you do not have permission.' });
    }

    // Students can only update if status is still Pending
    if (complaint.status !== 'Pending') {
      return res.status(400).json({ error: 'Cannot edit a complaint that is already being processed.' });
    }

    const { category, priority, title, description } = req.body;
    if (category) complaint.category = category;
    if (priority) complaint.priority = priority;
    if (title) complaint.title = title;
    if (description) complaint.description = description;

    await complaint.save();
    res.status(200).json({ complaint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/complaints/:id  — Student deletes their own complaint
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndDelete({ _id: req.params.id, studentId: req.user._id });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found or you do not have permission.' });
    }
    res.status(200).json({ message: 'Complaint withdrawn.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/complaints/:id/status  — Owner updates the complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Viewed', 'Respond', 'In Progress', 'Resolved', 'Maintenance'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const complaint = await Complaint.findOne({ _id: req.params.id, ownerId: req.user._id });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found or you do not have permission.' });
    }

    complaint.status = status;
    await complaint.save();

    // Notify the student of the status change
    await Notification.create({
      userId: complaint.studentId,
      senderId: req.user._id,
      type: 'General',
      title: `Complaint Update: ${complaint.title}`,
      message: `Your complaint has been updated to: ${status}`,
      isSystem: true,
    });

    res.status(200).json({ complaint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getComplaints, createComplaint, updateComplaint, deleteComplaint, updateComplaintStatus };
