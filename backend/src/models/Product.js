const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0.0 },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String, required: true }], // array of URLs or file paths
  category: { 
    type: String, 
    required: true,
    enum: [
      'Indoor Plants', 
      'Outdoor Plants', 
      'Flowering Plants', 
      'Succulents', 
      'Bonsai', 
      'Seeds', 
      'Pots & Accessories'
    ]
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  sunlight: { type: String, required: true }, // e.g. "Low Light", "Direct Sunlight"
  water: { type: String, required: true }, // e.g. "Once a week", "Every 2 days"
  careInstructions: { type: String, required: true },
  growthInfo: { type: String }, // e.g. "Grows up to 3 feet"
  indoorOutdoor: {
    type: String,
    required: true,
    enum: ['Indoor', 'Outdoor', 'Both']
  },
  rating: { type: Number, default: 0 }, // average rating
  numReviews: { type: Number, default: 0 } // review count
}, {
  timestamps: true
});

// Virtual field to quickly check availability status
productSchema.virtual('isAvailable').get(function() {
  return this.stock > 0;
});

// Ensure virtuals are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
