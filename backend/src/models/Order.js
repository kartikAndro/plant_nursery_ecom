const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

const statusLogSchema = new mongoose.Schema({
  status: { 
    type: String, 
    required: true,
    enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']
  },
  updatedAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true, default: 'Credit/Debit Card' },
  paymentStatus: { type: String, required: true, default: 'Pending' }, // e.g. "Pending", "Completed", "Refunded"
  deliveryStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  statusHistory: [statusLogSchema],
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date }
}, {
  timestamps: true
});

// Automatically push to status history before save if deliveryStatus changes
orderSchema.pre('save', function (next) {
  if (this.isModified('deliveryStatus') || this.isNew) {
    this.statusHistory.push({ status: this.deliveryStatus });
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
