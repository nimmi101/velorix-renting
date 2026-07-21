import express from 'express';
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
} from '../controllers/packageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/')
  .get(getPackages)
  .post(protect, admin, createPackage); // Protected admin route to create

router.route('/:id')
  .get(getPackageById)
  .put(protect, admin, updatePackage)    // Protected admin route to update
  .delete(protect, admin, deletePackage); // Protected admin route to delete

export default router;
