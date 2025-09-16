import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Pesticide', 'Fertilizer', 'Seed', 'Tool', 'Other']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: 0
  },
  hsn: {
    type: String,
    required: [true, 'HSN code is required'],
    trim: true
  },
  batch: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date
  },
  gstRate: {
    type: Number,
    required: [true, 'GST rate is required'],
    enum: [0, 5, 12, 18, 28],
    default: 18
  },
  description: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    default: 'Piece',
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', category: 'text' });

// Virtual for low stock check
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockThreshold;
});

export default mongoose.model('Product', productSchema);