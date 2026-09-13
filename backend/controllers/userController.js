const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, bio, farmName, farmLocation, farmSize, address } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (bio !== undefined) user.bio = bio;
  if (farmName !== undefined) user.farmName = farmName;
  if (farmLocation !== undefined) user.farmLocation = farmLocation;
  if (farmSize !== undefined) user.farmSize = farmSize;
  if (address) user.address = { ...user.address.toObject?.() || {}, ...address };

  // Handle avatar upload
  if (req.file) {
    user.avatar = req.file.path;
  }

  await user.save();

  res.json({ success: true, message: 'Profile updated successfully', user });
});

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 10, search } = req.query;
  const query = {};

  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const total = await User.countDocuments(query);
  const users = await User.find(query).skip(skip).limit(Number(limit)).sort('-createdAt');

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    users,
  });
});

// @desc    Get single user (admin)
// @route   GET /api/users/:id
// @access  Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, user });
});

// @desc    Toggle user active status (admin)
// @route   PUT /api/users/:id/toggle-status
// @access  Admin
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot deactivate admin accounts');
  }

  user.isActive = !user.isActive;
  await user.save();

  const Notification = require('../models/Notification');
  await Notification.create({
    user: user._id,
    title: user.isActive ? 'Account Activated' : 'Account Deactivated',
    message: user.isActive
      ? 'Your account has been reactivated. You can now access the platform.'
      : 'Your account has been deactivated. Please contact support for assistance.',
    type: 'account',
  });

  res.json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    user,
  });
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete admin accounts');
  }
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted successfully' });
});

module.exports = { getProfile, updateProfile, getAllUsers, getUserById, toggleUserStatus, deleteUser };
