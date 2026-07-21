import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify user is authenticated
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (split "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Decode token to get User ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB and attach to Request
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Not authorized, user not found'
        });
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, token failed or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, no token provided'
    });
  }
};

// Admin gate - verify user role is admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized as an administrator'
    });
  }
};
