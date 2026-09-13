const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Get all products with search/filter/pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    minPrice,
    maxPrice,
    location,
    isOrganic,
    status = 'active',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    farmer,
  } = req.query;

  const query = {};

  // Filter by status (public only sees active)
  if (req.user?.role === 'admin') {
    if (status && status !== 'all') query.status = status;
  } else if (req.user?.role === 'farmer' && farmer) {
    query.farmer = farmer;
    if (status && status !== 'all') query.status = status;
  } else {
    query.status = 'active';
  }

  if (search) {
    query.$text = { $search: search };
  }
  if (category) query.category = category;
  if (location) query.location = { $regex: location, $options: 'i' };
  if (isOrganic !== undefined) query.isOrganic = isOrganic === 'true';
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (farmer) query.farmer = farmer;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const products = await Product.find(query)
    .populate('category', 'name')
    .populate('farmer', 'name farmName farmLocation avatar')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name')
    .populate('farmer', 'name farmName farmLocation avatar phone');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Get reviews
  const reviews = await Review.find({ product: product._id })
    .populate('buyer', 'name avatar')
    .sort('-createdAt')
    .limit(10);

  res.json({ success: true, product, reviews });
});

// @desc    Create product
// @route   POST /api/products
// @access  Farmer
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, description, price, quantity, unit,
    category, location, harvestDate, isOrganic,
  } = req.body;

  const images = req.files
    ? req.files.map((f) => ({ url: f.path, public_id: f.filename }))
    : [];

  const product = await Product.create({
    name,
    description,
    price,
    quantity,
    unit,
    category,
    farmer: req.user._id,
    images,
    location,
    harvestDate,
    isOrganic: isOrganic === 'true' || isOrganic === true,
  });

  await product.populate('category', 'name');

  res.status(201).json({ success: true, product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Farmer (own product) or Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Only farmer who owns it or admin
  if (req.user.role === 'farmer' && product.farmer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  const {
    name, description, price, quantity, unit,
    category, location, harvestDate, isOrganic, status,
  } = req.body;

  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = Number(price);
  if (quantity !== undefined) product.quantity = Number(quantity);
  if (unit) product.unit = unit;
  if (category) product.category = category;
  if (location) product.location = location;
  if (harvestDate) product.harvestDate = harvestDate;
  if (isOrganic !== undefined) product.isOrganic = isOrganic === 'true' || isOrganic === true;
  if (status) product.status = status;

  // Add new images if uploaded
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => ({ url: f.path, public_id: f.filename }));
    product.images = [...product.images, ...newImages];
  }

  await product.save();
  await product.populate('category', 'name');

  res.json({ success: true, product });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Farmer (own) or Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (req.user.role === 'farmer' && product.farmer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Get farmer's own products
// @route   GET /api/products/my-products
// @access  Farmer
const getMyProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const query = { farmer: req.user._id };
  if (status && status !== 'all') query.status = status;

  const skip = (page - 1) * limit;
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    products,
  });
});

// @desc    Remove a product image
// @route   DELETE /api/products/:id/image/:imageId
// @access  Farmer
const removeProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  product.images = product.images.filter(
    (img) => img._id.toString() !== req.params.imageId
  );
  await product.save();

  res.json({ success: true, message: 'Image removed', images: product.images });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  removeProductImage,
};
