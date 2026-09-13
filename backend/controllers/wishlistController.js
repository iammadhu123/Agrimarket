const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

// @desc    Get wishlist
// @route   GET /api/wishlist
// @access  Buyer
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ buyer: req.user._id }).populate({
    path: 'products',
    populate: [
      { path: 'category', select: 'name' },
      { path: 'farmer', select: 'name farmName' },
    ],
  });

  res.json({ success: true, wishlist: wishlist || { products: [] } });
});

// @desc    Add to wishlist
// @route   POST /api/wishlist/add
// @access  Buyer
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ buyer: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ buyer: req.user._id, products: [productId] });
  } else {
    if (wishlist.products.includes(productId)) {
      res.status(400);
      throw new Error('Product already in wishlist');
    }
    wishlist.products.push(productId);
    await wishlist.save();
  }

  res.json({ success: true, message: 'Added to wishlist', wishlist });
});

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Buyer
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ buyer: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== req.params.productId
  );
  await wishlist.save();

  res.json({ success: true, message: 'Removed from wishlist', wishlist });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
