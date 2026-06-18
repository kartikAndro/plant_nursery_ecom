const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get all users list (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    // Supplement each user with their order count dynamically
    const usersWithOrderCount = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({ user: u._id });
        return {
          ...u.toJSON(),
          orderCount
        };
      })
    );

    res.json(usersWithOrderCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if trying to delete own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    // Cascade delete user reviews
    const Review = require('../models/Review');
    await Review.deleteMany({ user: user._id });

    // Cascade delete user orders
    const Order = require('../models/Order');
    await Order.deleteMany({ user: user._id });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, deleteUser };
