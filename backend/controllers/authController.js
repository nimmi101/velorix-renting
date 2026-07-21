import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'customer' // allows testing admin role creation directly if passed
    });

    if (user) {
      res.status(201).json({
        status: 'success',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Invalid user data provided'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email and explicitly include password field
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        status: 'success',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        status: 'success',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          wishlist: user.wishlist
        }
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      
      if (req.body.password) {
        user.password = req.body.password; // pre-save hook will re-hash it
      }

      const updatedUser = await user.save();

      res.status(200).json({
        status: 'success',
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          token: generateToken(updatedUser._id)
        }
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
