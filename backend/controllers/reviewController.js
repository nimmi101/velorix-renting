import Review from '../models/Review.js';
import Vehicle from '../models/Vehicle.js';
import Package from '../models/Package.js';

// @desc    Add review for vehicle or package
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res) => {
  const { vehicleId, packageId, rating, comment } = req.body;

  try {
    if (!vehicleId && !packageId) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide either a vehicle ID or a package ID'
      });
    }

    const reviewData = {
      user: req.user._id,
      rating: Number(rating),
      comment
    };

    // 1. If reviewing a vehicle
    if (vehicleId) {
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({
          status: 'error',
          message: 'Vehicle not found'
        });
      }

      // Check if user already reviewed this vehicle
      const alreadyReviewed = await Review.findOne({
        user: req.user._id,
        vehicle: vehicleId
      });

      if (alreadyReviewed) {
        return res.status(400).json({
          status: 'error',
          message: 'You have already submitted a review for this vehicle'
        });
      }

      reviewData.vehicle = vehicleId;
    }

    // 2. If reviewing a package
    if (packageId) {
      const tourPackage = await Package.findById(packageId);
      if (!tourPackage) {
        return res.status(404).json({
          status: 'error',
          message: 'Tour package not found'
        });
      }

      // Check if already reviewed
      const alreadyReviewed = await Review.findOne({
        user: req.user._id,
        tourPackage: packageId
      });

      if (alreadyReviewed) {
        return res.status(400).json({
          status: 'error',
          message: 'You have already submitted a review for this tour package'
        });
      }

      reviewData.tourPackage = packageId;
    }

    const review = await Review.create(reviewData);

    res.status(201).json({
      status: 'success',
      data: review
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all reviews for a vehicle
// @route   GET /api/reviews/vehicle/:vehicleId
// @access  Public
export const getVehicleReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ vehicle: req.params.vehicleId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all reviews for a tour package
// @route   GET /api/reviews/package/:packageId
// @access  Public
export const getPackageReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tourPackage: req.params.packageId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
