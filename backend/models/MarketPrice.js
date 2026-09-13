const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    marketName: {
      type: String,
      required: [true, 'Market name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    minPrice: {
      type: Number,
      required: [true, 'Minimum price is required'],
    },
    maxPrice: {
      type: Number,
      required: [true, 'Maximum price is required'],
    },
    avgPrice: {
      type: Number,
      required: [true, 'Average price is required'],
    },
    unit: {
      type: String,
      default: 'kg',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
