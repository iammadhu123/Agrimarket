const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');

// @desc    Submit complaint
// @route   POST /api/complaints
// @access  Private
const submitComplaint = asyncHandler(async (req, res) => {
  const { subject, description, category, priority } = req.body;

  const complaint = await Complaint.create({
    user: req.user._id,
    subject,
    description,
    category: category || 'other',
    priority: priority || 'medium',
  });

  res.status(201).json({ success: true, complaint });
});

// @desc    Get my complaints
// @route   GET /api/complaints/my-complaints
// @access  Private
const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, complaints });
});

// @desc    Get all complaints (admin)
// @route   GET /api/complaints
// @access  Admin
const getAllComplaints = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, priority } = req.query;
  const query = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const skip = (page - 1) * limit;
  const total = await Complaint.countDocuments(query);
  const complaints = await Complaint.find(query)
    .populate('user', 'name email role')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, total, complaints });
});

// @desc    Update complaint status (admin)
// @route   PUT /api/complaints/:id/status
// @access  Admin
const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  complaint.status = status;
  if (adminNote) complaint.adminNote = adminNote;
  if (status === 'resolved' || status === 'closed') {
    complaint.resolvedAt = new Date();
  }

  await complaint.save();

  // Notify user
  const Notification = require('../models/Notification');
  await Notification.create({
    user: complaint.user,
    title: `Complaint ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: `Your complaint "${complaint.subject}" has been updated to ${status}.${adminNote ? ' Admin note: ' + adminNote : ''}`,
    type: 'complaint',
  });

  res.json({ success: true, complaint });
});

module.exports = { submitComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus };
