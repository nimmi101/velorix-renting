import Package from '../models/Package.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get all active tour packages with filters
// @route   GET /api/packages
// @access  Public
export const getPackages = async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = { isActive: true };

    // Filter by package type (e.g. Hill Station, Beach)
    if (type) {
      query.type = type;
    }

    // Search by destination or name
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } }
      ];
    }

    const packages = await Package.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: packages.length,
      data: packages
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single tour package by ID
// @route   GET /api/packages/:id
// @access  Public
export const getPackageById = async (req, res) => {
  try {
    const tourPackage = await Package.findById(req.params.id);

    if (tourPackage) {
      res.status(200).json({
        status: 'success',
        data: tourPackage
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Tour package not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create a tour package (Admin only)
// @route   POST /api/packages
// @access  Private/Admin
export const createPackage = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (req.files && req.files.length) {
      const uploadedImages = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, file.mimetype, 'velorix/packages');
        uploadedImages.push(result.url);
      }
      payload.images = uploadedImages;
    }

    const tourPackage = new Package(payload);
    const createdPackage = await tourPackage.save();

    res.status(201).json({
      status: 'success',
      data: createdPackage
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update a tour package (Admin only)
// @route   PUT /api/packages/:id
// @access  Private/Admin
export const updatePackage = async (req, res) => {
  try {
    const tourPackage = await Package.findById(req.params.id);

    if (tourPackage) {
      const payload = { ...req.body };

      if (req.files && req.files.length) {
        const uploadedImages = [];
        for (const file of req.files) {
          const result = await uploadToCloudinary(file.buffer, file.mimetype, 'velorix/packages');
          uploadedImages.push(result.url);
        }
        payload.images = uploadedImages;
      }

      Object.keys(payload).forEach(key => {
        tourPackage[key] = payload[key] !== undefined ? payload[key] : tourPackage[key];
      });

      const updatedPackage = await tourPackage.save();

      res.status(200).json({
        status: 'success',
        data: updatedPackage
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Tour package not found'
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete a tour package (Admin only)
// @route   DELETE /api/packages/:id
// @access  Private/Admin
export const deletePackage = async (req, res) => {
  try {
    const tourPackage = await Package.findById(req.params.id);

    if (tourPackage) {
      await Package.deleteOne({ _id: req.params.id });
      res.status(200).json({
        status: 'success',
        message: 'Tour package deleted successfully'
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Tour package not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
