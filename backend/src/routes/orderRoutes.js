const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// User order routes
router.route('/').post(protect, addOrderItems);
router.route('/my-orders').get(protect, getMyOrders);

// Admin order routes
router.route('/').get(protect, admin, getOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
