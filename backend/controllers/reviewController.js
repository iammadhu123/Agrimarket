const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Helper to recalculate product rating
const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratings: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { ratings: 0, numReviews: 0 });
  }
};

// @desc    Add review
// @route   POST /api/reviews
// @access  Buyer
const addReview = asyncHandler(async (req, res) => {
  const { productId, orderId, rating, comment } = req.body;

  // Verify buyer purchased the product
  const order = await Order.findOne({
    _id: orderId,
    buyer: req.user._id,
    status: 'delivered',
    'items.product': productId,
  });

  if (!order) {
    res.status(400);
    throw new Error('You can only review products from delivered orders');
  }

  // Check if already reviewed
  const existing = await Review.findOne({
    product: productId,
    buyer: req.user._id,
    order: orderId,
  });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = await Review.create({
    product: productId,
    buyer: req.user._id,
    order: orderId,
    rating,
    comment,
  });

  await updateProductRating(review.product);
  await review.populate('buyer', 'name avatar');

  res.status(201).json({ success: true, review });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Buyer (own)
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.buyer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this review');
  }

  const { rating, comment } = req.body;
  if (rating) review.rating = rating;
  if (comment) review.comment = comment;
  await review.save();

  await updateProductRating(review.product);
  await review.populate('buyer', 'name avatar');

  res.json({ success: true, review });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Buyer (own) or Admin
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (req.user.role !== 'admin' && review.buyer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  const productId = review.product;
  await review.deleteOne();
  await updateProductRating(productId);

  res.json({ success: true, message: 'Review deleted' });
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('buyer', 'name avatar')
    .sort('-createdAt');

  res.json({ success: true, reviews });
});

// @desc    Get buyer's reviews
// @route   GET /api/reviews/my-reviews
// @access  Buyer
const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ buyer: req.user._id })
    .populate('product', 'name images')
    .sort('-createdAt');
  res.json({ success: true, reviews });
});

module.exports = { addReview, updateReview, deleteReview, getProductReviews, getMyReviews };
