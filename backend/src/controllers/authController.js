const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Utility
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          addresses: user.addresses,
          wishlist: user.wishlist,
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          addresses: user.addresses,
          wishlist: user.wishlist,
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist')
      .select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const populatedUser = await User.findById(updatedUser._id)
        .populate('wishlist')
        .select('-password');

      res.json(populatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a saved address
// @route   POST /api/auth/profile/addresses
// @access  Private
const addUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newAddress = req.body;

    // If new address is default, unset existing default addresses
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(newAddress);
    await user.save();

    const populatedUser = await User.findById(user._id)
      .populate('wishlist')
      .select('-password');
    res.json(populatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Edit a saved address
// @route   PUT /api/auth/profile/addresses/:id
// @access  Private
const updateUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addressId = req.params.id;
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const updatedAddress = req.body;

    // If setting as default, unset other defaults
    if (updatedAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      ...updatedAddress
    };

    await user.save();

    const populatedUser = await User.findById(user._id)
      .populate('wishlist')
      .select('-password');
    res.json(populatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a saved address
// @route   DELETE /api/auth/profile/addresses/:id
// @access  Private
const deleteUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();

    const populatedUser = await User.findById(user._id)
      .populate('wishlist')
      .select('-password');
    res.json(populatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle product in wishlist
// @route   POST /api/auth/profile/wishlist
// @access  Private
const toggleUserWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID is required' });

    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
      // Add to wishlist
      user.wishlist.push(productId);
    } else {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
    }

    await user.save();

    const populatedUser = await User.findById(user._id)
      .populate('wishlist')
      .select('-password');
    res.json(populatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mock Password Reset Request
// @route   POST /api/auth/reset-password-request
// @access  Public
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account with that email exists' });
    }

    // Mock reset code response
    res.json({
      message: `A simulated password reset email has been sent. Use the reset code '123456' to confirm.`,
      code: '123456'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mock Password Reset Confirm
// @route   POST /api/auth/reset-password-confirm
// @access  Public
const confirmPasswordReset = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (code !== '123456') {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
