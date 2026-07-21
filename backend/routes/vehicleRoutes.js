import express from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../controllers/vehicleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/')
  .get(getVehicles)
  .post(protect, admin, createVehicle); // Protected admin route to create

router.route('/:id')
  .get(getVehicleById)
  .put(protect, admin, updateVehicle)    // Protected admin route to update
  .patch(protect, admin, updateVehicle)  // Support patch as well for client flexibility
  .delete(protect, admin, deleteVehicle); // Protected admin route to delete

export default router;
