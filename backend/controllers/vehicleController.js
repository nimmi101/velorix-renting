import Vehicle from '../models/Vehicle.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get all vehicles with filters & search
// @route   GET /api/vehicles
// @access  Public
export const getVehicles = async (req, res) => {
  try {
    const { 
      category, 
      type, 
      seats, 
      transmission, 
      fuel, 
      priceMin, 
      priceMax, 
      search, 
      sort,
      availability
    } = req.query;

    let query = {};

    // 1. Search filter (brand or name matching keyword)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Exact match filters
    if (category) {
      // Handles comma separated values like ?category=SUV,Sedan
      const categories = category.split(',');
      query.category = { $in: categories };
    }

    if (type) {
      // type can be 'Self Drive', 'With Driver'
      query.type = { $in: [type, 'Both'] };
    }

    if (transmission) {
      query.transmission = transmission;
    }

    if (fuel) {
      query.fuel = fuel;
    }

    if (availability !== undefined) {
      query.availability = availability === 'true';
    }

    // 3. Seats filter (e.g. ?seats=7 or ?seats=4)
    if (seats) {
      // supports numeric filtering or ranges (e.g. seats=5, or seats=7+ which we'll parse)
      if (seats.endsWith('+')) {
        const minSeats = parseInt(seats.replace('+', ''), 10);
        query.seats = { $gte: minSeats };
      } else {
        query.seats = parseInt(seats, 10);
      }
    }

    // 4. Price range filter
    if (priceMin || priceMax) {
      query.pricePerDay = {};
      if (priceMin) query.pricePerDay.$gte = Number(priceMin);
      if (priceMax) query.pricePerDay.$lte = Number(priceMax);
    }

    // Initialize DB Query
    let dbQuery = Vehicle.find(query);

    // 5. Sorting
    if (sort) {
      switch (sort) {
        case 'priceAsc':
          dbQuery = dbQuery.sort({ pricePerDay: 1 });
          break;
        case 'priceDesc':
          dbQuery = dbQuery.sort({ pricePerDay: -1 });
          break;
        case 'ratingDesc':
          dbQuery = dbQuery.sort({ ratings: -1 });
          break;
        default:
          dbQuery = dbQuery.sort({ createdAt: -1 }); // newest first
      }
    } else {
      dbQuery = dbQuery.sort({ createdAt: -1 });
    }

    const vehicles = await dbQuery;

    res.status(200).json({
      status: 'success',
      results: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      res.status(200).json({
        status: 'success',
        data: vehicle
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Vehicle not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create a new vehicle (Admin only)
// @route   POST /api/vehicles
// @access  Private/Admin
export const createVehicle = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (req.files && req.files.length) {
      const uploadedImages = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, file.mimetype, 'velorix/vehicles');
        uploadedImages.push(result.url);
      }
      payload.images = uploadedImages;
    }

    const vehicle = new Vehicle(payload);
    const createdVehicle = await vehicle.save();

    res.status(201).json({
      status: 'success',
      data: createdVehicle
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update a vehicle (Admin only)
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      const payload = { ...req.body };

      if (req.files && req.files.length) {
        const uploadedImages = [];
        for (const file of req.files) {
          const result = await uploadToCloudinary(file.buffer, file.mimetype, 'velorix/vehicles');
          uploadedImages.push(result.url);
        }
        payload.images = uploadedImages;
      }

      Object.keys(payload).forEach(key => {
        vehicle[key] = payload[key] !== undefined ? payload[key] : vehicle[key];
      });

      const updatedVehicle = await vehicle.save();

      res.status(200).json({
        status: 'success',
        data: updatedVehicle
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Vehicle not found'
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete a vehicle (Admin only)
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      await Vehicle.deleteOne({ _id: req.params.id });
      res.status(200).json({
        status: 'success',
        message: 'Vehicle deleted successfully'
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Vehicle not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
