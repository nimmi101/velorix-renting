import express from 'express';
import {
  addReview,
  getVehicleReviews,
  getPackageReviews
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for fetching reviews
router.get('/vehicle/:vehicleId', getVehicleReviews);
router.get('/package/:packageId', getPackageReviews);

// Private route for adding review
router.post('/', protect, addReview);

export default router;
