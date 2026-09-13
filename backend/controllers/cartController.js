const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Buyer
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ buyer: req.user._id })
    .populate({
      path: 'items.product',
      populate: [
        { path: 'category', select: 'name' },
        { path: 'farmer', select: 'name farmName' },
      ],
    });

  if (!cart) {
    return res.json({ success: true, cart: { items: [], totalPrice: 0 } });
  }

  const totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  res.json({ success: true, cart, totalPrice });
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Buyer
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.status !== 'active') {
    res.status(400);
    throw new Error('Product is not available');
  }
  if (product.quantity < quantity) {
    res.status(400);
    throw new Error(`Only ${product.quantity} ${product.unit}(s) available`);
  }

  let cart = await Cart.findOne({ buyer: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      buyer: req.user._id,
      items: [{ product: productId, quantity: Number(quantity), price: product.price }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQty = existingItem.quantity + Number(quantity);
      if (product.quantity < newQty) {
        res.status(400);
        throw new Error(`Only ${product.quantity} ${product.unit}(s) available`);
      }
      existingItem.quantity = newQty;
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity), price: product.price });
    }

    await cart.save();
  }

  await cart.populate({
    path: 'items.product',
    populate: [
      { path: 'category', select: 'name' },
      { path: 'farmer', select: 'name farmName' },
    ],
  });

  const totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  res.json({ success: true, message: 'Item added to cart', cart, totalPrice });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Buyer
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const product = await Product.findById(productId);
  if (!product || product.quantity < quantity) {
    res.status(400);
    throw new Error(`Only ${product?.quantity || 0} units available`);
  }

  const cart = await Cart.findOne({ buyer: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error('Item not in cart');
  }

  item.quantity = Number(quantity);
  await cart.save();

  await cart.populate({
    path: 'items.product',
    populate: [
      { path: 'category', select: 'name' },
      { path: 'farmer', select: 'name farmName' },
    ],
  });

  const totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  res.json({ success: true, cart, totalPrice });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Buyer
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ buyer: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );
  await cart.save();

  const totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  res.json({ success: true, message: 'Item removed', cart, totalPrice });
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Buyer
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ buyer: req.user._id }, { items: [] });
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
