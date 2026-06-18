const Review = require('../models/Review');
const Product = require('../models/Product');

// Recalculates product rating indices
const updateProductRatingIndex = async (productId) => {
  const reviews = await Review.find({ product: productId });
  
  const numReviews = reviews.length;
  let rating = 0;

  if (numReviews > 0) {
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    rating = parseFloat((sum / numReviews).toFixed(1));
  }

  await Product.findByIdAndUpdate(productId, {
    rating,
    numReviews
  });
};

// @desc    Create a product review
// @route   POST /api/reviews
// @access  Private
const createProductReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  try {
    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: 'All review fields are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      user: req.user._id,
      name: req.user.name,
      product: productId,
      rating: Number(rating),
      comment
    });

    await review.save();
    await updateProductRatingIndex(productId);

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product review
// @route   PUT /api/reviews/:id
// @access  Private
const updateProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure it is their own review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    review.rating = Number(rating) || review.rating;
    review.comment = comment || review.comment;

    await review.save();
    await updateProductRatingIndex(review.product);

    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteProductReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure they own the review or are an Admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);
    await updateProductRatingIndex(productId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProductReview,
  updateProductReview,
  deleteProductReview
};
