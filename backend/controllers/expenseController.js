const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');

// @desc    Get farmer's expenses
// @route   GET /api/expenses
// @access  Farmer
const getExpenses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, month, year } = req.query;
  const query = { farmer: req.user._id };

  if (category) query.category = category;
  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    query.date = { $gte: start, $lte: end };
  } else if (year) {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);
    query.date = { $gte: start, $lte: end };
  }

  const skip = (page - 1) * limit;
  const total = await Expense.countDocuments(query);
  const expenses = await Expense.find(query).sort('-date').skip(skip).limit(Number(limit));

  // Category-wise totals
  const categoryStats = await Expense.aggregate([
    { $match: { farmer: req.user._id } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
  ]);

  // Total all-time
  const totalExpense = await Expense.aggregate([
    { $match: { farmer: req.user._id } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  // Monthly totals (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyStats = await Expense.aggregate([
    { $match: { farmer: req.user._id, date: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    success: true,
    total,
    expenses,
    categoryStats,
    totalExpense: totalExpense[0]?.total || 0,
    monthlyStats,
  });
});

// @desc    Add expense
// @route   POST /api/expenses
// @access  Farmer
const addExpense = asyncHandler(async (req, res) => {
  const { title, category, amount, date, description } = req.body;

  const expense = await Expense.create({
    farmer: req.user._id,
    title,
    category,
    amount,
    date: date || new Date(),
    description,
  });

  res.status(201).json({ success: true, expense });
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Farmer
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, farmer: req.user._id });

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  const { title, category, amount, date, description } = req.body;
  if (title) expense.title = title;
  if (category) expense.category = category;
  if (amount) expense.amount = amount;
  if (date) expense.date = date;
  if (description !== undefined) expense.description = description;

  await expense.save();
  res.json({ success: true, expense });
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Farmer
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, farmer: req.user._id });

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  await expense.deleteOne();
  res.json({ success: true, message: 'Expense deleted' });
});

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense };
