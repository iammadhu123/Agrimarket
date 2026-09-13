const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Expense category is required'],
      enum: ['seeds', 'fertilizer', 'pesticides', 'labour', 'irrigation', 'equipment', 'transportation', 'other'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
