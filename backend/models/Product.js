const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['kg', 'gram', 'litre', 'ml', 'piece', 'dozen', 'quintal', 'ton', 'bundle'],
      default: 'kg',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    harvestDate: Date,
    isOrganic: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'out_of_stock', 'inactive'],
      default: 'active',
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Product', productSchema);
