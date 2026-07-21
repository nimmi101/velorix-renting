import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a package name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  type: {
    type: String,
    required: [true, 'Please specify package category'],
    enum: [
      'Domestic',
      'Hill Station',
      'Beach',
      'Pilgrimage',
      'Adventure',
      'Family',
      'Corporate',
      'Wedding'
    ]
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Please specify duration (e.g. 3 Days / 2 Nights)']
  },
  days: {
    type: Number,
    required: [true, 'Please specify exact day count']
  },
  recommendedVehicleCategory: {
    type: String,
    required: [true, 'Please specify recommended vehicle category'],
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
  basePrice: {
    type: Number,
    required: [true, 'Please add a base price']
  },
  images: {
    type: [String],
    default: []
  },
  itinerary: [itinerarySchema],
  inclusions: {
    type: [String],
    default: ['Luxury Vehicle Transfer', 'Professional Driver', 'Toll Tax & Fuel Charges', 'Driver Stay & Food Allowance']
  },
  exclusions: {
    type: [String],
    default: ['Monument Entry Tickets', 'Personal Expenses', 'Hotel Stay (Unless Requested)', 'Meals & Sightseeing Guides']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Package = mongoose.model('Package', packageSchema);
export default Package;
