const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalFarmers,
    totalBuyers,
    totalProducts,
    totalOrders,
    pendingOrders,
    openComplaints,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: 'admin' } }),
    User.countDocuments({ role: 'farmer' }),
    User.countDocuments({ role: 'buyer' }),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Complaint.countDocuments({ status: 'open' }),
  ]);

  // Total revenue from delivered/paid orders
  const revenueResult = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // Monthly orders (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyOrders = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Monthly registrations
  const monthlyUsers = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Order status distribution
  const orderStatusDist = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Category-wise products
  const categoryDist = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    { $project: { name: '$category.name', count: 1 } },
    { $sort: { count: -1 } },
  ]);

  // Recent orders
  const recentOrders = await Order.find()
    .populate('buyer', 'name')
    .sort('-createdAt')
    .limit(5);

  // Recent users
  const recentUsers = await User.find({ role: { $ne: 'admin' } })
    .sort('-createdAt')
    .limit(5);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalFarmers,
      totalBuyers,
      totalProducts,
      totalOrders,
      pendingOrders,
      openComplaints,
      totalRevenue,
    },
    charts: {
      monthlyOrders,
      monthlyUsers,
      orderStatusDist,
      categoryDist,
    },
    recentOrders,
    recentUsers,
  });
});

// @desc    Send notification to user(s)
// @route   POST /api/admin/notify
// @access  Admin
const sendNotification = asyncHandler(async (req, res) => {
  const { userId, title, message, type, sendToAll, role } = req.body;

  if (sendToAll) {
    const query = role ? { role } : { role: { $ne: 'admin' } };
    const users = await User.find(query, '_id');
    const notifications = users.map((u) => ({
      user: u._id,
      title,
      message,
      type: type || 'general',
    }));
    await Notification.insertMany(notifications);
    return res.json({ success: true, message: `Notification sent to ${notifications.length} users` });
  }

  if (!userId) {
    res.status(400);
    throw new Error('userId or sendToAll is required');
  }

  await Notification.create({ user: userId, title, message, type: type || 'general' });
  res.json({ success: true, message: 'Notification sent' });
});

// @desc    Get sales report
// @route   GET /api/admin/reports
// @access  Admin
const getReports = asyncHandler(async (req, res) => {
  const { year = new Date().getFullYear() } = req.query;

  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59);

  const monthlySales = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, paymentStatus: 'paid' } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $match: { status: 'delivered' } },
    { $unwind: '$items' },
    { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
  ]);

  const topFarmers = await Order.aggregate([
    { $match: { status: 'delivered' } },
    { $unwind: '$items' },
    { $group: { _id: '$items.farmer', totalOrders: { $sum: 1 }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
    { $sort: { revenue: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'farmer' } },
    { $unwind: '$farmer' },
    { $project: { name: '$farmer.name', totalOrders: 1, revenue: 1 } },
  ]);

  res.json({ success: true, monthlySales, topProducts, topFarmers });
});

module.exports = { getDashboardStats, sendNotification, getReports };
