const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');

// Helper to send notifications
const createNotification = async (userId, title, message, type = 'order') => {
  await Notification.create({ user: userId, title, message, type });
};

// @desc    Place order
// @route   POST /api/orders
// @access  Buyer
const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'cod', items: directItems } = req.body;

  let orderItems = [];
  let itemsPrice = 0;

  if (directItems && directItems.length > 0) {
    // Direct buy (buy now)
    for (const item of directItems) {
      const product = await Product.findById(item.productId).populate('farmer');
      if (!product || product.status !== 'active') {
        res.status(400);
        throw new Error(`Product ${item.productId} is not available`);
      }
      if (product.quantity < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url || '',
        farmer: product.farmer._id,
      });
      itemsPrice += product.price * item.quantity;
    }
  } else {
    // From cart
    const cart = await Cart.findOne({ buyer: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error('Cart is empty');
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id).populate('farmer');
      if (!product || product.status !== 'active') {
        res.status(400);
        throw new Error(`Product ${item.product.name} is no longer available`);
      }
      if (product.quantity < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        price: item.price,
        quantity: item.quantity,
        image: product.images[0]?.url || '',
        farmer: product.farmer._id,
      });
      itemsPrice += item.price * item.quantity;
    }
  }

  const deliveryCharge = itemsPrice > 500 ? 0 : 40;
  const totalAmount = itemsPrice + deliveryCharge;

  const order = await Order.create({
    buyer: req.user._id,
    items: orderItems,
    shippingAddress,
    itemsPrice,
    deliveryCharge,
    totalAmount,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
  });

  // Deduct stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: -item.quantity },
    });
    // Update status if out of stock
    const updated = await Product.findById(item.product);
    if (updated && updated.quantity <= 0) {
      updated.status = 'out_of_stock';
      await updated.save();
    }
  }

  // Clear cart
  if (!directItems) {
    await Cart.findOneAndUpdate({ buyer: req.user._id }, { items: [] });
  }

  // Create payment record
  await Payment.create({
    order: order._id,
    buyer: req.user._id,
    amount: totalAmount,
    method: paymentMethod,
    status: paymentMethod === 'cod' ? 'pending' : 'pending',
  });

  // Notify farmers
  const farmerIds = [...new Set(orderItems.map((i) => i.farmer.toString()))];
  for (const farmerId of farmerIds) {
    await createNotification(
      farmerId,
      'New Order Received',
      `You have received a new order #${order._id.toString().slice(-6).toUpperCase()}.`,
      'order'
    );
  }

  // Notify buyer
  await createNotification(
    req.user._id,
    'Order Placed Successfully',
    `Your order #${order._id.toString().slice(-6).toUpperCase()} has been placed. Total: ₹${totalAmount}`,
    'order'
  );

  await order.populate([
    { path: 'items.product', select: 'name images' },
    { path: 'buyer', select: 'name email' },
  ]);

  res.status(201).json({ success: true, order });
});

// @desc    Get buyer's orders
// @route   GET /api/orders/my-orders
// @access  Buyer
const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const query = { buyer: req.user._id };
  if (status && status !== 'all') query.status = status;

  const skip = (page - 1) * limit;
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('items.product', 'name images')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, total, orders });
});

// @desc    Get farmer orders
// @route   GET /api/orders/farmer-orders
// @access  Farmer
const getFarmerOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const query = { 'items.farmer': req.user._id };
  if (status && status !== 'all') query.status = status;

  const skip = (page - 1) * limit;
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('buyer', 'name email phone')
    .populate('items.product', 'name images price')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, total, orders });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Buyer (own) | Farmer (their items) | Admin
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('buyer', 'name email phone')
    .populate('items.product', 'name images price unit')
    .populate('items.farmer', 'name farmName phone');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Authorization check
  if (
    req.user.role === 'buyer' &&
    order.buyer._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, order });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Farmer | Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };

  if (!validTransitions[order.status]?.includes(status)) {
    res.status(400);
    throw new Error(`Cannot change status from '${order.status}' to '${status}'`);
  }

  order.status = status;

  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.paymentStatus = order.paymentMethod === 'cod' ? 'paid' : order.paymentStatus;
    if (order.paymentMethod === 'cod') {
      order.paidAt = new Date();
      await Payment.findOneAndUpdate(
        { order: order._id },
        { status: 'success', paidAt: new Date() }
      );
    }
  }

  if (status === 'cancelled') {
    order.cancelledAt = new Date();
    order.cancelReason = req.body.cancelReason || 'Cancelled';
    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: item.quantity },
      });
    }
  }

  await order.save();

  // Notify buyer
  const statusMessages = {
    confirmed: 'Your order has been confirmed!',
    processing: 'Your order is being processed.',
    shipped: 'Your order has been shipped and is on the way!',
    delivered: 'Your order has been delivered. Enjoy your products!',
    cancelled: 'Your order has been cancelled.',
  };

  await createNotification(
    order.buyer,
    `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    `Order #${order._id.toString().slice(-6).toUpperCase()}: ${statusMessages[status] || ''}`,
    'order'
  );

  res.json({ success: true, message: `Order status updated to ${status}`, order });
});

// @desc    Cancel order (buyer)
// @route   PUT /api/orders/:id/cancel
// @access  Buyer
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.buyer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (!['pending', 'confirmed'].includes(order.status)) {
    res.status(400);
    throw new Error('Order cannot be cancelled at this stage');
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  order.cancelReason = req.body.cancelReason || 'Cancelled by buyer';

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: item.quantity },
    });
  }

  await order.save();

  await createNotification(
    order.buyer,
    'Order Cancelled',
    `Your order #${order._id.toString().slice(-6).toUpperCase()} has been cancelled.`,
    'order'
  );

  res.json({ success: true, message: 'Order cancelled successfully', order });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const query = {};
  if (status && status !== 'all') query.status = status;

  const skip = (page - 1) * limit;
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('buyer', 'name email')
    .populate('items.product', 'name images')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, total, orders });
});

module.exports = {
  placeOrder,
  getMyOrders,
  getFarmerOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
};
