const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// @desc    Initiate mock payment
// @route   POST /api/payments/initiate
// @access  Buyer
const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findOne({ _id: orderId, buyer: req.user._id });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.paymentStatus === 'paid') {
    res.status(400);
    throw new Error('Order is already paid');
  }

  // Mock payment response (replace with real gateway in production)
  const mockTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  res.json({
    success: true,
    paymentData: {
      orderId: order._id,
      amount: order.totalAmount,
      currency: 'INR',
      transactionId: mockTransactionId,
      key: 'mock_key', // Replace with real Razorpay key_id
    },
  });
});

// @desc    Verify / confirm payment
// @route   POST /api/payments/verify
// @access  Buyer
const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, transactionId, paymentMethod = 'online' } = req.body;

  const order = await Order.findOne({ _id: orderId, buyer: req.user._id });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Mark order as paid
  order.paymentStatus = 'paid';
  order.paidAt = new Date();
  if (order.status === 'pending') order.status = 'confirmed';
  await order.save();

  // Update payment record
  await Payment.findOneAndUpdate(
    { order: orderId },
    { status: 'success', transactionId, paidAt: new Date(), method: paymentMethod },
    { upsert: true }
  );

  // Notify buyer
  const Notification = require('../models/Notification');
  await Notification.create({
    user: req.user._id,
    title: 'Payment Successful',
    message: `Payment of ₹${order.totalAmount} for order #${order._id.toString().slice(-6).toUpperCase()} was successful.`,
    type: 'payment',
  });

  res.json({ success: true, message: 'Payment verified successfully', order });
});

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Buyer
const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ buyer: req.user._id })
    .populate('order', 'totalAmount status createdAt')
    .sort('-createdAt');

  res.json({ success: true, payments });
});

module.exports = { initiatePayment, verifyPayment, getPaymentHistory };
