const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Fetch all products with filtering, search, and sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      difficulty, 
      indoorOutdoor, 
      minPrice, 
      maxPrice, 
      availability,
      sortBy 
    } = req.query;

    let query = {};

    // 1. Search filter (case-insensitive name search)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // 2. Category filter
    if (category) {
      // Support comma-separated categories or single category
      const categories = category.split(',');
      query.category = { $in: categories };
    }

    // 3. Difficulty filter
    if (difficulty) {
      const difficulties = difficulty.split(',');
      query.difficulty = { $in: difficulties };
    }

    // 4. Indoor/Outdoor filter
    if (indoorOutdoor) {
      const ios = indoorOutdoor.split(',');
      query.indoorOutdoor = { $in: ios };
    }

    // 5. Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 6. Availability filter
    if (availability === 'true') {
      query.stock = { $gt: 0 };
    }

    // Build the query
    let apiQuery = Product.find(query);

    // 7. Sorting
    if (sortBy) {
      if (sortBy === 'priceAsc') {
        apiQuery = apiQuery.sort({ price: 1 });
      } else if (sortBy === 'priceDesc') {
        apiQuery = apiQuery.sort({ price: -1 });
      } else if (sortBy === 'newest') {
        apiQuery = apiQuery.sort({ createdAt: -1 });
      } else if (sortBy === 'popularity') {
        apiQuery = apiQuery.sort({ rating: -1, numReviews: -1 });
      }
    } else {
      // Default sort (newest)
      apiQuery = apiQuery.sort({ createdAt: -1 });
    }

    const products = await apiQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID and include reviews
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Find reviews for this product
      const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });
      
      // Return combined object
      res.json({
        ...product.toJSON(),
        reviews
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      category,
      stock,
      difficulty,
      sunlight,
      water,
      careInstructions,
      growthInfo,
      indoorOutdoor
    } = req.body;

    // Field validations
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: 'Product title must be at least 3 characters long' });
    }
    if (price === undefined || Number(price) <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }
    if (stock === undefined || Number(stock) < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ message: 'Description must be at least 10 characters long' });
    }
    if (!images || images.length === 0 || !images[0]) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    const product = new Product({
      name,
      price,
      description,
      images: images || ['https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80'],
      category,
      stock: Number(stock) || 0,
      difficulty,
      sunlight,
      water,
      careInstructions,
      growthInfo,
      indoorOutdoor
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      category,
      stock,
      difficulty,
      sunlight,
      water,
      careInstructions,
      growthInfo,
      indoorOutdoor
    } = req.body;

    // Field validations
    if (name !== undefined && name.trim().length < 3) {
      return res.status(400).json({ message: 'Product title must be at least 3 characters long' });
    }
    if (price !== undefined && Number(price) <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }
    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }
    if (description !== undefined && description.trim().length < 10) {
      return res.status(400).json({ message: 'Description must be at least 10 characters long' });
    }
    if (images !== undefined && (images.length === 0 || !images[0])) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.category = category || product.category;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      product.difficulty = difficulty || product.difficulty;
      product.sunlight = sunlight || product.sunlight;
      product.water = water || product.water;
      product.careInstructions = careInstructions || product.careInstructions;
      product.growthInfo = growthInfo || product.growthInfo;
      product.indoorOutdoor = indoorOutdoor || product.indoorOutdoor;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Remove product reviews too
      await Review.deleteMany({ product: product._id });
      await Product.findByIdAndDelete(req.params.id);
      
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
