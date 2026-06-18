const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  toggleUserWishlist,
  requestPasswordReset,
  confirmPasswordReset
} = require('../controllers/authController');
const { protect, customer } = require('../middleware/authMiddleware');

// Public Auth routes
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/reset-password-request', requestPasswordReset);
router.post('/reset-password-confirm', confirmPasswordReset);

// Private Auth routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/profile/wishlist')
  .post(protect, customer, toggleUserWishlist);

router.route('/profile/addresses')
  .post(protect, customer, addUserAddress);

router.route('/profile/addresses/:id')
  .put(protect, customer, updateUserAddress)
  .delete(protect, customer, deleteUserAddress);

module.exports = router;
