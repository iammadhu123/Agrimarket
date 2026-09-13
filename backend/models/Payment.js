const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ['cod', 'online', 'upi', 'card', 'netbanking'],
      default: 'cod',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: String,
    gatewayResponse: Object, // store raw gateway response
    paidAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
