import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import { sendBookingConfirmationEmail } from '../utils/emailService.js';

// Helper: Calculate total days between two dates (inclusive of partial days)
const calculateTotalDays = (start, end) => {
  const diffTime = Math.abs(new Date(end) - new Date(start));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 0 ? 1 : diffDays;
};

// @desc    Create a new booking reservation
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  const { 
    vehicleId, 
    car,
    pickupLocation, 
    dropLocation, 
    startDate, 
    endDate, 
    driverOption, 
    extraServices,
    paymentMethod,
    transactionId
  } = req.body;

  try {
    // 1. Verify vehicle exists
    let vehicle;
    if (vehicleId) {
      vehicle = await Vehicle.findById(vehicleId);
    } else if (car) {
      const cleanCar = car.replace(/\s*\(.*\)\s*/g, ''); // strip (SUV), (MUV) etc.
      if (cleanCar.toLowerCase().includes('any')) {
        vehicle = await Vehicle.findOne({ availability: true });
      } else {
        const words = cleanCar.split(' ');
        vehicle = await Vehicle.findOne({
          $or: [
            { name: { $regex: cleanCar, $options: 'i' } },
            { brand: { $regex: cleanCar, $options: 'i' } },
            { name: { $regex: words[words.length - 1], $options: 'i' } }
          ]
        });
      }
    }

    if (!vehicle) {
      vehicle = await Vehicle.findOne({ availability: true }) || await Vehicle.findOne();
    }

    if (!vehicle) {
      return res.status(404).json({
        status: 'error',
        message: 'Selected vehicle not found'
      });
    }

    if (!vehicle.availability) {
      return res.status(400).json({
        status: 'error',
        message: 'Vehicle is currently offline or undergoing maintenance'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        status: 'error',
        message: 'Return date must be after pickup date'
      });
    }

    // 2. Double Booking Check (Scheduling Conflicts)
    const conflictingBooking = await Booking.findOne({
      vehicle: vehicle._id,
      status: { $in: ['Pending', 'Confirmed'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } } // overlaps
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({
        status: 'error',
        message: 'This vehicle is already reserved for the selected dates'
      });
    }

    // 3. Pricing Math
    const totalDays = calculateTotalDays(startDate, endDate);

    // Validate booking duration constraints (bypassed for quick taxi)
    if (!car) {
      if (totalDays < vehicle.minDuration) {
        return res.status(400).json({
          status: 'error',
          message: `Minimum booking duration for this vehicle is ${vehicle.minDuration} days`
        });
      }

      if (totalDays > vehicle.maxDuration) {
        return res.status(400).json({
          status: 'error',
          message: `Maximum booking duration for this vehicle is ${vehicle.maxDuration} days`
        });
      }
    }

    const baseRentalCost = vehicle.pricePerDay * totalDays;
    const finalDriverOption = car ? true : !!driverOption; // Taxis default to having a driver
    const driverCost = finalDriverOption ? (vehicle.driverChargesPerDay * totalDays) : 0;
    
    // Sum flat fees for requested extras
    let extrasCost = 0;
    const resolvedExtras = [];
    if (extraServices && Array.isArray(extraServices)) {
      extraServices.forEach(extra => {
        extrasCost += extra.price;
        resolvedExtras.push({ name: extra.name, price: extra.price });
      });
    }

    const securityDeposit = vehicle.securityDeposit;
    const tax = Math.round((baseRentalCost + driverCost + extrasCost) * 0.18); // 18% tax
    const totalAmount = baseRentalCost + driverCost + extrasCost + securityDeposit + tax;

    // 4. Construct Booking
    const booking = new Booking({
      user: req.user._id,
      vehicle: vehicle._id,
      pickupLocation,
      dropLocation,
      startDate: start,
      endDate: end,
      driverOption: finalDriverOption,
      extraServices: resolvedExtras,
      pricingBreakdown: {
        baseRentalCost,
        driverCost,
        extrasCost,
        securityDeposit,
        tax,
        totalAmount
      },
      paymentStatus: transactionId ? 'Paid' : 'Pending',
      paymentDetails: transactionId ? {
        transactionId,
        paymentMethod: paymentMethod || 'Card',
        paymentDate: new Date()
      } : {},
      status: transactionId ? 'Confirmed' : 'Pending'
    });

    const savedBooking = await booking.save();
    
    // Fetch user-populated booking details to send custom confirmation email
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate('user', 'name email')
      .populate('vehicle', 'name brand category');

    // Trigger confirmation email asynchronously only if confirmed immediately
    if (savedBooking.status === 'Confirmed') {
      try {
        await sendBookingConfirmationEmail(populatedBooking);
      } catch (emailErr) {
        console.error('Nodemailer verification email dispatch failed:', emailErr.message);
      }
    }

    res.status(201).json({
      status: 'success',
      data: populatedBooking
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all bookings (Admin sees all, Customer sees their own)
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res) => {
  try {
    let query = {};
    
    // If not admin, restrict query to user's bookings
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('vehicle', 'name brand category images pricePerDay')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle', 'name brand category images pricePerDay seats transmission fuel')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking record not found'
      });
    }

    // Auth gate: user owns booking OR is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this booking record'
      });
    }

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking record not found'
      });
    }

    // Verify ownership or admin privilege
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        status: 'error',
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'Completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot cancel a completed trip'
      });
    }

    // Check if cancellation is within window (e.g. before pickup starts)
    if (new Date() >= new Date(booking.startDate)) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot cancel a trip after its scheduled pickup start date'
      });
    }

    booking.status = 'Cancelled';
    booking.paymentStatus = booking.paymentStatus === 'Paid' ? 'Refunded' : booking.paymentStatus;
    
    await booking.save();

    res.status(200).json({
      status: 'success',
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  const { status, paymentStatus } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking record not found'
      });
    }

    const wasConfirmed = booking.status === 'Confirmed';
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    if (status === 'Confirmed' && !wasConfirmed) {
      // Fetch user-populated booking details to send custom confirmation email
      const populatedBooking = await Booking.findById(booking._id)
        .populate('user', 'name email')
        .populate('vehicle', 'name brand category');

      try {
        await sendBookingConfirmationEmail(populatedBooking);
      } catch (emailErr) {
        console.error('Nodemailer verification email dispatch failed:', emailErr.message);
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get dates where vehicle is booked (Calendar integration)
// @route   GET /api/bookings/calendar/:vehicleId
// @access  Public
export const getVehicleAvailabilityCalendar = async (req, res) => {
  try {
    const bookings = await Booking.find({
      vehicle: req.params.vehicleId,
      status: { $in: ['Pending', 'Confirmed'] },
      endDate: { $gte: new Date() } // active or future bookings only
    }).select('startDate endDate -_id');

    res.status(200).json({
      status: 'success',
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
