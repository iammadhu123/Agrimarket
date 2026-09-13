const asyncHandler = require('express-async-handler');
const MarketPrice = require('../models/MarketPrice');

// @desc    Get market prices
// @route   GET /api/market-prices
// @access  Public
const getMarketPrices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, location, date } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { cropName: { $regex: search, $options: 'i' } },
      { marketName: { $regex: search, $options: 'i' } },
    ];
  }
  if (location) query.location = { $regex: location, $options: 'i' };
  if (date) {
    const d = new Date(date);
    query.date = { $gte: new Date(d.setHours(0, 0, 0, 0)), $lte: new Date(d.setHours(23, 59, 59, 999)) };
  }

  const skip = (page - 1) * limit;
  const total = await MarketPrice.countDocuments(query);
  const prices = await MarketPrice.find(query)
    .populate('addedBy', 'name')
    .sort('-date')
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, total, prices });
});

// @desc    Create market price
// @route   POST /api/market-prices
// @access  Admin
const createMarketPrice = asyncHandler(async (req, res) => {
  const { cropName, marketName, location, minPrice, maxPrice, avgPrice, unit, date } = req.body;

  const price = await MarketPrice.create({
    cropName,
    marketName,
    location,
    minPrice,
    maxPrice,
    avgPrice,
    unit: unit || 'kg',
    date: date || new Date(),
    addedBy: req.user._id,
  });

  res.status(201).json({ success: true, price });
});

// @desc    Update market price
// @route   PUT /api/market-prices/:id
// @access  Admin
const updateMarketPrice = asyncHandler(async (req, res) => {
  const price = await MarketPrice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!price) {
    res.status(404);
    throw new Error('Market price not found');
  }

  res.json({ success: true, price });
});

// @desc    Delete market price
// @route   DELETE /api/market-prices/:id
// @access  Admin
const deleteMarketPrice = asyncHandler(async (req, res) => {
  const price = await MarketPrice.findById(req.params.id);

  if (!price) {
    res.status(404);
    throw new Error('Market price not found');
  }

  await price.deleteOne();
  res.json({ success: true, message: 'Market price deleted' });
});

module.exports = { getMarketPrices, createMarketPrice, updateMarketPrice, deleteMarketPrice };
