import express from 'express';
import User from '../models/User.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all registered users
// @route   GET /api/users
// @access  Admin only
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Admin only
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @desc    Update user role (make admin/user)
// @route   PATCH /api/users/:id/role
// @access  Admin only
router.patch('/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ status: 'error', message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
