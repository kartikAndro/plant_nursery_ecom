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

module.exports = { getUsers };
