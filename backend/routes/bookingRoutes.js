import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
  getVehicleAvailabilityCalendar
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get calendar bookings (Public for guest checks)
router.get('/calendar/:vehicleId', getVehicleAvailabilityCalendar);

// User's own bookings
router.route('/my')
  .get(protect, getBookings);

// General bookings routes
router.route('/')
  .post(protect, createBooking)
  .get(protect, getBookings);

// Individual booking routes
router.route('/:id')
  .get(protect, getBookingById);

router.route('/:id/cancel')
  .put(protect, cancelBooking);

router.route('/:id/status')
  .put(protect, admin, updateBookingStatus)  // Admin only
  .patch(protect, admin, updateBookingStatus); // Also accept PATCH

export default router;
