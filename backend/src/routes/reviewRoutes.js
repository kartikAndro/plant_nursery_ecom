const express = require('express');
const router = express.Router();
const {
  createProductReview,
  updateProductReview,
  deleteProductReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createProductReview);
router.route('/:id')
  .put(protect, updateProductReview)
  .delete(protect, deleteProductReview);

module.exports = router;
