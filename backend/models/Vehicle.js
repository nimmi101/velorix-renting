import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a vehicle name'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Sedan',
      'SUV',
      'Hatchback',
      'Luxury',
      'Tempo Traveller',
      'Mini Bus',
      'Luxury Coach',
      'Tourist Bus'
    ]
  },
  type: {
    type: String,
    required: [true, 'Please specify rental type'],
    enum: ['Self Drive', 'With Driver', 'Both'],
    default: 'With Driver'
  },
  seats: {
    type: Number,
    required: [true, 'Please specify seat count']
  },
  transmission: {
    type: String,
    required: [true, 'Please specify transmission'],
    enum: ['Automatic', 'Manual']
  },
  fuel: {
    type: String,
    required: [true, 'Please specify fuel type'],
    enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid']
  },
  ac: {
    type: Boolean,
    default: true
  },
  luggage: {
    type: Number,
    default: 2 // luggage bag count
  },
  images: {
    type: [String],
    default: [] // Cloudinary image urls
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Please add price per day']
  },
  pricePerKm: {
    type: Number,
    default: 0 // applicable mostly for coaches/travellers
  },
  driverChargesPerDay: {
    type: Number,
    default: 0 // charges for professional driver per day
  },
  securityDeposit: {
    type: Number,
    default: 0
  },
  minDuration: {
    type: Number,
    default: 1 // minimum rental days
  },
  maxDuration: {
    type: Number,
    default: 30 // maximum rental days
  },
  includedKmPerDay: {
    type: Number,
    default: 150 // standard free km allowance
  },
  extraKmCharge: {
    type: Number,
    default: 12 // penalty charge per km beyond allowance
  },
  pickupLocations: {
    type: [String],
    default: ['Airport Terminal 1', 'Main City Office', 'Downtown Hub']
  },
  cancellationPolicy: {
    type: String,
    default: 'Free cancellation up to 24 hours before pickup. After that, 50% fee applies.'
  },
  documentsRequired: {
    type: [String],
    default: ['Driving License', 'Aadhaar Card / Passport', 'Security Deposit Authorization']
  },
  insuranceDetails: {
    type: String,
    default: 'Comprehensive insurance included. Collision damage waiver (CDW) available.'
  },
  features: {
    type: [String],
    default: ['GPS Navigation', 'Bluetooth Audio', 'Airbags', 'ABS', 'Rear View Camera']
  },
  availability: {
    type: Boolean,
    default: true
  },
  ratings: {
    type: Number,
    default: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
